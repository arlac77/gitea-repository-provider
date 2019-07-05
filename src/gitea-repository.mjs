import fetch from "node-fetch";
import { Repository } from "repository-provider";
import { join } from "./util.mjs";
import { GiteaBranch } from "./gitea-branch.mjs";

export class GiteaRepository extends Repository {

  async _fetchPullRequests() {
    const result = await fetch(
      join(this.provider.api, "repos", this.fullName, "pulls"),
      {
        headers: this.provider.headers,
        accept: "application/json"
      }
    );

    for (const p of await result.json()) {
      const getBranch = async u => this.provider.branch([u.repo.full_name,u.ref].join('#'));

      const pr = new this.pullRequestClass(
        await getBranch(p.head),
        await getBranch(p.base),
        String(p.number),
        {
          id: p.id,
          title: p.title,
          body: p.body,
          state: p.state
        }
      );
      this._pullRequests.set(pr.name, pr);
    }
  }

  async _fetchBranches() {
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

  async _fetchHooks() {
    const result = await fetch(
      join(this.provider.api, "repos", this.fullName, "hooks"),
      {
        headers: this.provider.headers,
        accept: "application/json"
      }
    );
    
    for (const h of await result.json()) {
      this._hooks.push(new this.hookClass(this, h.name, new Set(h.events), {
        id: h.id,
        active: h.active,
        type: h.type,
        ...h.config
      }));
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
