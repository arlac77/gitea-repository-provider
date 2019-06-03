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
   * @param {Object} env process environment
   * @param {string} env.GITEA_TOKEN api token
   * @param {string} env.GITEA_API api url
   * @return {Object} with auth token
   */
  static optionsFromEnvironment(env) {
    return { token: env.GITEA_TOKEN, api: env.GITEA_API };
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
      await group.createRepository(rn, r);
    }
  }
}
