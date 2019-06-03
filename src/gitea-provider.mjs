import {
  Provider,
  RepositoryGroup,
  Repository,
  Branch
} from "repository-provider";
import fetch from "node-fetch";

function join(a, b) {
  return [a, b].join("/");
}

/**
 * Gitea provider
 *
 */
export class GiteaProvider extends Provider {
  /**
   * provide token and api from one of
   * - GITEA_TOKEN
   * - GITEA_API
   * @param {Object} env process env
   * @return {Object} with auth token
   */
  static optionsFromEnvironment(env) {
    const token = env.GITEA_TOKEN;
    const api = env.GITEA_API;
    return { token, api };
  }

  static get defaultOptions() {
    return {
      api: undefined,
      token: undefined,
      ...super.defaultOptions
    };
  }

  /**
   * fetch headers
   * @return {Object} suitable as fetch headers
   */
  get headers() {
    return {
      authorization: "token " + this.token
    };
  }

  async _initialize() {
    await this.fetchAllRepositories();
  }

  async fetchAllRepositories() {
    const result = await fetch(join(this.api, "repos/search"), {
      headers: this.headers,
      accept: "application/json"
    });

    const json = await result.json();

    for (const r of json.data) {
      const [gn, rn] = r.full_name.split(/\//);
      const group = await this.createRepositoryGroup(gn, r.owner);
      await group.createRepository(rn,r);
    }
  }
}
