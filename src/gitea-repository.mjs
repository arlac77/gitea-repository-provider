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

  async fetch(...parts) {
    return await fetch(
      new URL(join("repos", this.fullName, ...parts), this.provider.api),
      {
        headers: this.provider.headers,
        accept: "application/json"
      }
    );
  }

  async initializeBranches() {
    const result = await this.fetch("branches");

    for (const bd of await result.json()) {
      await this.addBranch(bd.name, bd);
    }
  }

  async initializeHooks() {
    const result = await this.fetch("hooks");

    for (const h of await result.json()) {
      this.addHook(
        new this.hookClass(this, h.id, new Set(h.events), {
          ...h,
          ...h.config
        })
      );
    }
  }

  async refId(ref) {
    const result = await this.fetch("git", ref);
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
