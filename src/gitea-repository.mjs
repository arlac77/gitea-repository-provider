import { replaceWithOneTimeExecutionMethod } from "one-time-execution-method";
import { Repository } from "repository-provider";
import { join } from "./util.mjs";
import { GiteaBranch } from "./gitea-branch.mjs";

export class GiteaRepository extends Repository {
  static get attributeMapping() {
    return {
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
      allow_manual_merge: { type: "boolean", default: false, writable: true },
      allow_merge_commits: { type: "boolean", default: false, writable: true },
      allow_rebase: { type: "boolean", default: false, writable: true },
      allow_rebase_explicit: {
        type: "boolean",
        default: false,
        writable: true
      },
      allow_squash_merge: { type: "boolean", default: false, writable: true },
      autodetect_manual_merge: {
        type: "boolean",
        default: false,
        writable: true
      },
      ignore_whitespace_conflicts: {
        type: "boolean",
        default: false,
        writable: true
      },
      default_delete_branch_after_merge: {
        type: "boolean",
        default: false,
        writable: true
      },
      default_merge_style: { type: "string", writable: true }
    };
  }

  fetch(path, ...args) {
    return this.provider.fetch(join("repos", this.fullName, path),...args);
  }

  fetchJSON(path, ...args) {
    return this.provider.fetchJSON(join("repos", this.fullName, path), ...args);
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
      this.addHook(
        new this.hookClass(this, h.id, new Set(h.events), {
          ...h,
          ...h.config
        })
      );
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
