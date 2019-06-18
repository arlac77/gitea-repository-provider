import fetch from "node-fetch";
import { BaseCollectionEntry } from "content-entry/src/base-collection-entry.mjs";
import { BaseEntry } from "content-entry/src/base-entry.mjs";
import { Branch } from "repository-provider";
import { join } from "./util.mjs";

export class GiteaBranch extends Branch {
  async *entries(patterns) {

    const url = join(this.provider.api, "repos", this.repository.fullName, "git/trees", await this.refId()) + '?recursive=true';
    //console.log('URL', url);

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
          yield new GiteaContentEntry(entry);
      }
    }
  }
}

class GiteaContentEntry extends BaseEntry {
  constructor(entry)
  {
    super(entry.path);
  }
}