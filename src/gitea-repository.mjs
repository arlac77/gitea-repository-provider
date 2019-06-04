import fetch from "node-fetch";
import { Repository } from "repository-provider";
import { join } from "./util.mjs";

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
}
