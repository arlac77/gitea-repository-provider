import fetch from "node-fetch";
import { stateActionHandler } from "fetch-rate-limit-util";
import { getHeaderLink } from "fetch-link-util";
import { replaceWithOneTimeExecutionMethod } from "one-time-execution-method";

import { MultiGroupProvider } from "repository-provider";
import { GiteaRepository } from "./gitea-repository.mjs";
import { GiteaPullRequest } from "./gitea-pull-request.mjs";
import { GiteaOrganization } from "./gitea-organization.mjs";
import { GiteaUser } from "./gitea-user.mjs";
import { join } from "./util.mjs";

/**
 * Gitea provider.
 * Known environment variables:
 * - GITEA_TOKEN api token
 * - GITEA_API api url
 */
export class GiteaProvider extends MultiGroupProvider {
  /**
   * We are called gitea.
   * @return {string} gitea
   */
  static get name() {
    return "gitea";
  }

  /**
   * @return {string} default env name prefix
   */
  static get instanceIdentifier() {
    return "GITEA_";
  }

  static get attributes() {
    return {
      ...super.attributes,

      api: {
        type: "url",
        description: "URL of the provider api",
        set: value =>
          value === undefined || value.endsWith("/") ? value : value + "/",
        env: "{{instanceIdentifier}}API",
        mandatory: true
      },

      token: {
        type: "string",
        description: "API token",
        env: "{{instanceIdentifier}}TOKEN",
        private: true,
        mandatory: true
      }
    };
  }

  fetch(url, options = {}, responseHandler) {
    return stateActionHandler(
      fetch,
      new URL(url, this.api),
      {
        ...options,
        headers: {
          authorization: `token ${this.token}`,
          ...options.headers
        }
      },
      responseHandler,
      undefined,
      (url, ...args) => this.trace(url.toString(), ...args)
    );
  }

  fetchJSON(url, options) {
    return this.fetch(
      url,
      {
        headers: {
          "Content-Type": "application/json"
        },
        ...options
      },
      async response => {
        return { response, json: await response.json() };
      }
    );
  }

  async initializeRepositories() {
    let next = "repos/search?limit=1000";
    do {
      const { response, json } = await this.fetchJSON(next);

      if (!response.ok) {
        console.log(response);
        return;
      }

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

    let clazz;
    let result;

    const f = async type => {
      clazz = type === "users" ? GiteaUser : GiteaOrganization;
      result = await this.fetch(join(type, name));
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
   * All possible base urls.
   * @return {string[]} common base urls of all repositories
   */
  get repositoryBases() {
    return super.repositoryBases.concat([this.api.replace(/api\/v.+$/, "")]);
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
