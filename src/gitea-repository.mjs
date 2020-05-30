import fetch from "node-fetch";
import { replaceWithOneTimeExecutionMethod } from "one-time-execution-method";
import { Repository, mapAttributes } from "repository-provider";
import { join } from "./util.mjs";
import { GiteaBranch } from "./gitea-branch.mjs";

const branchAttributeMapping = {
  protected: "isProtected"
};

export class GiteaRepository extends Repository {
  async initializeBranches() {
    const result = await fetch(
      join(this.provider.api, "repos", this.fullName, "branches"),
      {
        headers: this.provider.headers,
        accept: "application/json"
      }
    );

    for (const bd of await result.json()) {
      await this.addBranch(bd.name, mapAttributes(bd, branchAttributeMapping));
    }
  }

  async initializeHooks() {
    const result = await fetch(
      join(this.provider.api, "repos", this.fullName, "hooks"),
      {
        headers: this.provider.headers,
        accept: "application/json"
      }
    );

    for (const h of await result.json()) {
      this.addHook(
        new this.hookClass(this, h.name, new Set(h.events), {
          id: h.id,
          active: h.active,
          type: h.type,
          ...h.config
        })
      );
    }
  }

  async refId(ref) {
    const result = await fetch(
      join(this.provider.api, "repos", this.fullName, "git", ref),
      {
        headers: this.provider.headers,
        accept: "application/json"
      }
    );

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
