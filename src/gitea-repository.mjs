import { replaceWithOneTimeExecutionMethod } from "one-time-execution-method";
import {
  Repository,
  boolean_attribute,
  url_attribute,
  empty_attiribute,
  count_attribute
} from "repository-provider";
import { join } from "./util.mjs";
import { GiteaBranch } from "./gitea-branch.mjs";

/**
 * @see {https://try.gitea.io/api/swagger#/repository/repoGet}
 */
export class GiteaRepository extends Repository {
  static get attributeMapping() {
    return {
      fork: "isFork",
      archived: "isArchived",
      template: "isTemplate",
      private: "isPrivate",
      mirror: "isMirror",
      website: "homePageURL",
      default_branch: "defaultBranchName"
    };
  }

  static get attributes() {
    return {
      ...super.attributes,
      allow_manual_merge: boolean_attribute,
      allow_merge_commits: boolean_attribute,
      allow_rebase: boolean_attribute,
      allow_rebase_explicit: boolean_attribute,
      allow_squash_merge: boolean_attribute,
      autodetect_manual_merge: boolean_attribute,
      ignore_whitespace_conflicts: boolean_attribute,
      default_delete_branch_after_merge: boolean_attribute,
      default_merge_style: boolean_attribute,
      stars_count: count_attribute,
      ssh_url: url_attribute,
      empty: empty_attiribute,
      open_issues_count: count_attribute,
      open_pr_counter: count_attribute,
      watchers_count: count_attribute,
      release_counter: count_attribute,
      has_projects: boolean_attribute,
      has_pull_requests: boolean_attribute,
      has_wiki: boolean_attribute,
      forks_count: count_attribute
    };
  }

  fetch(path, options) {
    return this.provider.fetch(join("repos", this.fullName, path), options);
  }

  fetchJSON(path, options) {
    return this.provider.fetchJSON(join("repos", this.fullName, path), options);
  }

  /**
   * {@link https://try.gitea.io/api/swagger#/repository/repoEdit}
   */
  async update() {
    return this.fetch("", {
      method: "PATCH",

      headers: {
        "content-type": "application/json"
      },

      body: JSON.stringify(
        mapAttributesInverse(
          optionJSON(this, undefined, this.constructor.writableAttributes),
          this.constructor.attributeMapping
        )
      )
    });
  }

  async initializeBranches() {
    const { json } = await this.fetchJSON("branches");
    for (const bd of json) {
      this.addBranch(bd.name, bd);
    }
  }

  async createBranch(name, from, options) {
    const branch = await super.branch(name);

    if (branch) {
      return branch;
    }

    const body = {
      new_branch_name: name
    };

    if (from) {
      body.old_branch_name = from.name;
    }

    const { json } = await this.fetchJSON("branches", {
      method: "POST",
      body: JSON.stringify(body)
    });

    return this.addBranch(name, json);
  }

  async initializeHooks() {
    const { json } = await this.fetchJSON("hooks");

    for (const h of json) {
      this.addHook(h.id, {
        ...h,
        ...h.config
      });
    }
  }

  async refId(ref) {
    const { json } = await this.fetchJSON(`git/${ref}`);

    if (Array.isArray(json)) {
      return json[0].object.sha;
    }

    return json.object.sha;
  }

  get branchClass() {
    return GiteaBranch;
  }
}

replaceWithOneTimeExecutionMethod(
  GiteaRepository.prototype,
  "initializeBranches"
);
replaceWithOneTimeExecutionMethod(GiteaRepository.prototype, "initializeHooks");
replaceWithOneTimeExecutionMethod(
  GiteaRepository.prototype,
  "initializePullRequests"
);
