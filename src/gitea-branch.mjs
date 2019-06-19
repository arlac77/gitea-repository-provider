import fetch from "node-fetch";
import { BaseCollectionEntry } from "content-entry/src/base-collection-entry.mjs";
import { ContentEntry } from "content-entry/src/content-entry.mjs";
import { StreamContentEntryMixin } from "content-entry/src/stream-content-entry-mixin.mjs";
import { Branch } from "repository-provider";
import { join } from "./util.mjs";

export class GiteaBranch extends Branch {
  async *entries(patterns) {

    const url = join(this.provider.api, "repos", this.repository.fullName, "git/trees", await this.refId()) + '?recursive=true';

    const result = await fetch(url,
      {
        headers: this.provider.headers,
        accept: "application/json"
      }
    );

    const json = await result.json();
    for (const entry of await json.tree) {
      switch (entry.type) {
        case 'tree':
          yield new BaseCollectionEntry(entry.path);
          break;
        default:
          yield new GiteaContentEntry(this, entry);
      }
    }
  }
}

class GiteaContentEntry extends StreamContentEntryMixin(ContentEntry) {
  constructor(branch, entry) {
    super(entry.path);
    Object.defineProperties(this, { 'branch': { value: branch } });
  }

  get provider() {
    return this.branch.provider;
  }

  async getReadStream(options) {
    const url = join(this.provider.api, "repos", this.branch.repository.fullName, "raw", this.name);
    const result = await fetch(url,
      {
        headers: this.provider.headers
      }
    );

    return await result.body;
  }
}