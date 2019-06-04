import fetch from "node-fetch";
import { Repository } from "repository-provider";
import { join } from "./util.mjs";
import { GiteaBranch } from "./gitea-branch.mjs";

export class GiteaRepository extends Repository {
  async _initialize() {
    await this.fetchAllBranches();
  }

  async fetchAllBranches() {
    const result = await fetch(
      join(this.provider.api, "repos", this.fullName, "branches"),
      {
        headers: this.provider.headers,
        accept: "application/json"
      }
    );

    for (const bd of await result.json()) {
      await this._createBranch(bd.name, undefined, bd);
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
    return data.object.sha;
  }

  get branchClass() {
    return GiteaBranch;
  }
}
