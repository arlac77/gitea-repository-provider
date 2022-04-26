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

  async fetch(path, options) {
    return await this.provider.fetch(join("repos", this.fullName, path), {
      headers: {
        "content-type": "application/json"
      },
      ...options
    });
  }

  /**
   * {@link https://try.gitea.io/api/swagger#/repository/repoEdit}
   */
  async update() {
    return this.fetch("", {
      method: "PATCH",
      body: JSON.stringify(
        mapAttributesInverse(
          optionJSON(this, undefined, this.constructor.writableAttributes),
          this.constructor.attributeMapping
        )
      )
    });
  }

  async initializeBranches() {
    const result = await this.fetch("branches");

    if (!result.ok) {
      console.log(result);
      return;
    }

    for (const bd of await result.json()) {
      this.addBranch(bd.name, bd);
    }
  }

  async createBranch(name, from, options) {
    const branch = this._branches.get(name);
    if (branch) {
      return branch;
    }

    const body = {
      new_branch_name: name
    };

    if (from) {
      body.old_branch_name = from.name;
    }

    const result = await this.fetch("branches", {
      method: "POST",
      body: JSON.stringify(body)
    });

    if (result.ok) {
      return this.addBranch(name, await result.json());
    }

    throw result;
  }

  async initializeHooks() {
    const result = await this.fetch("hooks");

    if (!result.ok) {
      console.log(result);
      return;
    }

    for (const h of await result.json()) {
      const id = h.id;
      delete h.id;
      this.addHook(
        new this.hookClass(this, id, new Set(h.events), {
          ...h,
          ...h.config
        })
      );
    }
  }

  async refId(ref) {
    const result = await this.fetch(`git/${ref}`);
    const data = await result.json();

    if (Array.isArray(data)) {
      return data[0].object.sha;
    }

    return data.object.sha;
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
