import fetch from "node-fetch";
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
      allow_merge_commits: { type: "boolean" },
      allow_rebase: { type: "boolean" },
      allow_rebase_explicit: { type: "boolean" },
      allow_squash_merge: { type: "boolean" },
      ignore_whitespace_conflicts: { type: "boolean" }
    };
  }

  async fetch(path, options) {
    return await fetch(
      new URL(join("repos", this.fullName, path), this.provider.api),
      {
        headers: {
          ...this.provider.headers,
          "content-type": "application/json"
        },
        ...options
      }
    );
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
