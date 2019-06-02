import { Provider, Repository, Branch } from "repository-provider";
import fetch from "node-fetch";


function join(a,b) {
  return [a,b].join('/');
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

  async *repositories(pattern) {
    const result = await fetch(join(this.api, "repos/search"), {
      headers: {
        authorization: "token " + this.token,
    //    "Accept-Encoding": "identity"
      },
      accept: "application/json"
    });

    const json = await result.json();

    for (const r of json.data) {
      //console.log(r);
      const repository = new Repository(this,r.name,r);

      yield repository;
    }
  }
}
