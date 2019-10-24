import fetch from "node-fetch";

import { Provider } from "repository-provider";
import { GiteaRepository } from "./gitea-repository.mjs";
import { GiteaPullRequest } from "./gitea-pull-request.mjs";
import { GiteaOrganization } from "./gitea-organization.mjs";
import { GiteaUser } from "./gitea-user.mjs";
import { join } from "./util.mjs";

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
      GITEA_TOKEN: "token",
      GITEA_API: "api"
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
    let page = 1;

    while (true) {
      const result = await fetch(
        join(this.api, `repos/search?limit=50&page=${page}`),
        {
          headers: this.headers,
          accept: "application/json"
        }
      );

      const json = await result.json();
      if (json.data.length === 0) {
        break;
      }

      for (const r of json.data) {
        const [gn, rn] = r.full_name.split(/\//);
        const group = await this.createRepositoryGroup(gn, r.owner);
        await group.createRepository(rn, r);
      }

      page++;
    }
  }

  async _createRepositoryGroup(name, options) {
    const fetchOptions = {
      headers: this.headers,
      accept: "application/json"
    };

    let clazz;
    let result = await fetch(join(this.api, "orgs", name), fetchOptions);

    if (result.ok) {
      clazz = GiteaOrganization;
    } else {
      clazz = GiteaUser;
      result = await fetch(join(this.api, "users", name), fetchOptions);
    }

    const data = await result.json();

    const repositoryGroup = new clazz(this, name, data);
    await repositoryGroup.initialize();
    this._repositoryGroups.set(repositoryGroup.name, repositoryGroup);
    return repositoryGroup;
  }

  /**
   * All possible base urls
   * @return {string[]} common base urls of all repositories
   */
  get repositoryBases() {
    return [this.api.replace(/api\/v.+$/, "")];
  }

  get repositoryClass() {
    return GiteaRepository;
  }

  get pullRequestClass() {
    return GiteaPullRequest;
  }

  get repositoryGroupClass() {
    return GiteaOrganization;
  }
}
