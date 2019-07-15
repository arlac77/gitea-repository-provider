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

    const getBranch = async u =>
        provider.branch([u.repo.full_name, u.ref].join("#"));

    for (const p of await result.json()) {
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
    const provider = source.provider;

    const data = {
      base: source.name,
      head: destination.name,
      ...options
    };

    const result = await fetch(
      join(provider.api, "repos", destination.repository.fullName, "pulls"),
      {
        method: "POST",
        headers: {
          'Content-Type' : 'application/json',
          ...provider.headers },
        body: JSON.stringify(data)
      }
    );

   // console.log(await result.text());

    const json = await result.json();
    console.log(json);

    return new this(source, destination, json.number, {
      body: json.body,
      title: json.title,
      state: json.state
    });
  }

  async decline() {
  }

  async _write() {
  }
  
  async _merge(method) {
  }
}
