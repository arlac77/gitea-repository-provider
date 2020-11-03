import fetch from "node-fetch";
import { getHeaderLink } from "fetch-link-util";
import { replaceWithOneTimeExecutionMethod } from "one-time-execution-method";

import { MultiGroupProvider } from "repository-provider";
import { GiteaRepository } from "./gitea-repository.mjs";
import { GiteaPullRequest } from "./gitea-pull-request.mjs";
import { GiteaOrganization } from "./gitea-organization.mjs";
import { GiteaUser } from "./gitea-user.mjs";
import { join } from "./util.mjs";

/**
 * Gitea provider
 * Known environment variables
 * - GITEA_TOKEN api token
 * - GITEA_API api url
 */
export class GiteaProvider extends MultiGroupProvider {
  static get attributes() {
    return {
      ...super.attributes,

      api: {
        type: "url",
        description: "URL of the provider api",
        set: value => (value.endsWith("/") ? value : value + "/"),
        env: "GITEA_API",
        mandatory: true
      },

      token: {
        type: "string",
        description: "API token",
        env: "GITEA_TOKEN",
        private: true,
        mandatory: true
      }
    };
  }

  /**
   * Fetch headers
   * @return {Object} suitable as fetch headers
   */
  get headers() {
    return {
      authorization: "token " + this.token
    };
  }

  async initializeRepositories() {
    let next = new URL("repos/search?limit=1000", this.api);
    do {
      const response = await fetch(next, {
        headers: this.headers,
        accept: "application/json"
      });

      if (!response.ok) {
        console.log(response);
        return;
      }

      const json = await response.json();
      for (const r of json.data) {
        const group = await this.addRepositoryGroup(r.owner.username, r.owner);
        group.addRepository(r.name, r);
      }

      next = getHeaderLink(response.headers);
    } while (next);
  }

  async addRepositoryGroup(name, options) {
    let repositoryGroup = this._repositoryGroups.get(name);
    if (repositoryGroup) {
      return repositoryGroup;
    }

    const fetchOptions = {
      headers: this.headers,
      accept: "application/json"
    };

    let clazz;
    let result;

    const f = async type => {
      clazz = type === "users" ? GiteaUser : GiteaOrganization;
      result = await fetch(new URL(join(type, name), this.api), fetchOptions);
    };

    await f(options && options.email ? "users" : "orgs");

    if (!result.ok) {
      await f(clazz === GiteaUser ? "users" : "orgs");
    }

    if (!result.ok) {
      console.log(result);
      return;
    }

    repositoryGroup = new clazz(this, name, await result.json());
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

  /**
   * We are called gitea
   * @return {string} gitea
   */
  get name() {
    return "gitea";
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

replaceWithOneTimeExecutionMethod(
  GiteaProvider.prototype,
  "initializeRepositories"
);

export default GiteaProvider;
