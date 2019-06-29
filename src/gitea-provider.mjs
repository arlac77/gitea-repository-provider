import fetch from "node-fetch";

import { Provider } from "repository-provider";
import { GiteaRepository } from './gitea-repository.mjs';
import { join } from './util.mjs';

/**
 * Gitea provider
 *
 */
export class GiteaProvider extends Provider {
  /**
   * known environment variables
   * @return {Object} 
   * @return {string} GITEA_TOKEN api token
   * @return {string} GITEA_API api url
   */
  static get environmentOptions() {
    return {
      'GITEA_TOKEN': 'token',
      'GITEA_API': 'api'
    };
  }

  static get defaultOptions() {
    return {
      api: undefined,
      token: undefined,
      ...super.defaultOptions
    };
  }

  /**
   * @param {Object} options 
   * @return {boolean} true if token an api are present
   */
  static areOptionsSufficciant(options) {
    return options.token !== undefined && options.api !== undefined;
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
    const result = await fetch(join(this.api, "repos/search?limit=50"), {
      headers: this.headers,
      accept: "application/json"
    });

    const json = await result.json();
    for (const r of json.data) {
      const [gn, rn] = r.full_name.split(/\//);
      const group = await this.createRepositoryGroup(gn, r.owner);
      await group.createRepository(rn, r);
      //console.log(group.name, rn);
    }

    /*delete json.data;
    console.log(JSON.stringify(json,undefined,2));
    */
  }

  /**
   * All possible base urls
   * @return {string[]} common base urls of all repositories
   */
  get repositoryBases()
  {
    return [this.api.replace(/api\/v.+$/, '')];
  }

  get repositoryClass() {
    return GiteaRepository;
  }
}
