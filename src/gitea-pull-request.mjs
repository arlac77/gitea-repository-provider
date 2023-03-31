import {
  PullRequest,
  boolean_attribute,
  default_attribute
} from "repository-provider";
import { join } from "./util.mjs";

/**
 *
 */
export class GiteaPullRequest extends PullRequest {
  static get attributes() {
    return {
      ...super.attributes,
      state: {
        ...default_attribute,
        values: new Set(["OPEN", "CLOSED"]),
        writeable: true
      },
      mergeable: boolean_attribute
    };
  }

  static get attributeMapping() {
    return {
      is_locked: "locked"
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
      for (const s of this.constructor.attributes.state.values)
        if (filter.states.has(s)) {
          state = s.toLocaleLowerCase();
          break;
        }
    }

    const getBranch = async u =>
      provider.branch([u.repo.full_name, u.ref].join("#"));

    const { json } = await respository.fetchJSON(`pulls?state=${state}`);

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

  async _merge(method) {}
}
