import fetch from "node-fetch";

import { PullRequest } from "repository-provider";
import { join } from "./util.mjs";

/**
 *
 */
export class GiteaPullRequest extends PullRequest {
  static get validStates() {
    return new Set(["OPEN", "CLOSED"]);
  }

  static get attributes() {
    return {
      ...super.attributes,
      mergeable: { type: "boolean" }
    };
  }

  /**
   * List all pull request for a given repo.
   * Result will be filtered by source branch, destination branch and states.
   * @param {Repository} respository
   * @param {Object} filter
   * @param {Branch?} filter.source
   * @param {Branch?} filter.destination
   * @param {Set<string>?} filter.states
   * @return {Iterator<PullRequest>}
   */
  static async *list(respository, filter = {}) {
    const provider = respository.provider;

    let state = "all";

    if (filter.states) {
      for (const s of GiteaPullRequest.validStates)
        if (filter.states.has(s)) {
          state = s.toLocaleLowerCase();
          break;
        }
    }

    const getBranch = async u =>
      provider.branch([u.repo.full_name, u.ref].join("#"));

    const result = await respository.fetch(`pulls?state=${state}`);

    if (!result.ok) {
      console.log(result);
      return;
    }

    const json = await result.json();
    for (const p of json) {
      const source = await getBranch(p.head);
      if (filter.source && !source.equals(filter.source)) {
        continue;
      }

      const destination = await getBranch(p.base);
      if (filter.destination && !destination.equals(filter.destination)) {
        continue;
      }

      yield new provider.pullRequestClass(source, destination, p.number, {
        id: p.id,
        title: p.title,
        body: p.body,
        state: p.state
      });
    }
  }

  static async open(source, destination, options) {
    const provider = source.provider;

    const data = {
      base: source.name,
      head: destination.name,
      ...options
    };

    const result = await fetch(
      new URL(
        join("repos", destination.repository.fullName, "pulls"),
        provider.api
      ),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...provider.headers
        },
        body: JSON.stringify(data)
      }
    );


    const json = await result.json();

    return new this(source, destination, json.number, {
      body: json.body,
      title: json.title,
      state: json.state
    });
  }

  async decline() {}

  async _write() {}

  async _merge(method) {}
}
