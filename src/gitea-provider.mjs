import fetch from "node-fetch";
import { stateActionHandler } from "fetch-rate-limit-util";
import { getHeaderLink } from "fetch-link-util";
import { replaceWithOneTimeExecutionMethod } from "one-time-execution-method";

import { MultiGroupProvider, url_attribute, secret_attribute } from "repository-provider";
import { GiteaRepository } from "./gitea-repository.mjs";
import { GiteaPullRequest } from "./gitea-pull-request.mjs";
import { GiteaOrganization } from "./gitea-organization.mjs";
import { GiteaUser } from "./gitea-user.mjs";

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
        ...url_attribute,
        description: "URL of the provider api",
        set: value =>
          value === undefined || value.endsWith("/") ? value : value + "/",
        env: "{{instanceIdentifier}}API",
        mandatory: true
      },

      token: {
        ...secret_attribute,
        description: "API token",
        env: "{{instanceIdentifier}}TOKEN",
        mandatory: true
      }
    };
  }

  fetch(url, options = {}) {
    options.reporter = (url, ...args) => this.trace(url.toString(), ...args);
    return stateActionHandler(
      fetch,
      new URL(url, this.api),
      {
        ...options,
        headers: {
          authorization: `token ${this.token}`,
          ...options.headers
        }
      }      
    );
  }

  fetchJSON(url, options) {
    return this.fetch(
      url,
      {
        headers: {
          "Content-Type": "application/json"
        },
        postprocess: async response => {
          return { response, json: await response.json() };
        },
        ...options
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
        (await this.addRepositoryGroup(r.owner.username, r.owner)).addRepository(r.name, r);
      }

      next = getHeaderLink(response.headers);
    } while (next);
  }

/*
  async addRepositoryGroup(name, options) {
    let repositoryGroup = await this.repositoryGroup(name);
    if (repositoryGroup) {
      return repositoryGroup;
    }

    let clazz,r;

    const f = async isUser => {
      clazz = isUser ? GiteaUser : GiteaOrganization;
      r = await this.fetchJSON(join(isUser ? "users" : "orgs", name));
    };

    await f(options?.email);

    if (!r.result.ok) {
      await f(clazz === GiteaUser);
    }

    if (!r.result.ok) {
      console.log(r.result);
      return;
    }

    return new clazz(this, name, await r.json);
  }
*/

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
