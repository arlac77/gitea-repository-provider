import { Provider, Repository, Branch } from "repository-provider";
import fetch from "node-fetch";

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

  async *repositories(pattern) {
    const result = await fetch(this.api + "repos/search", {
      headers: { authorization: "token " + this.token },
      accept: "application/json"
    });
    console.log(result);
    repos = await result.json(result);
    for (const r of result) {
      yield r;
    }
  }
}
