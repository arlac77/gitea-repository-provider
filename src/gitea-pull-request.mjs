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

  /**
   * list all pull request for a given destination repo
   * @param {Repository} destination
   * @param {Set<string>} states
   */
  static async *list(destination, states) {
    const provider = destination.provider;

    const result = await fetch(
      join(
        provider.api,
        "repos",
        destination.fullName,
        "pulls"
      ) /*+ '?states=all'*/,
      {
        headers: provider.headers,
        accept: "application/json"
      }
    );

    for (const p of await result.json()) {
      const getBranch = async u =>
        provider.branch([u.repo.full_name, u.ref].join("#"));

      yield new provider.pullRequestClass(
        await getBranch(p.head),
        await getBranch(p.base),
        String(p.number),
        {
          id: p.id,
          title: p.title,
          body: p.body,
          state: p.state
        }
      );
    }
  }

  static async open(source, destination, options) {
    const result = await fetch(
      join(provider.api, "repos", this.fullName, "pulls"),
      {
        method: "POST",
        data: {
          base: source.name,
          head: destination.name,
          ...options
        }
      }
    );

    console.log(result);
    return new this(source, destination, "4711", {
      description: p.description,
      title: p.title,
      state: p.state
    });
  }

  async merge() {}
}
