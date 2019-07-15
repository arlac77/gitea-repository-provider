import fetch from "node-fetch";
import { BaseCollectionEntry } from "content-entry/src/base-collection-entry.mjs";
import { ContentEntry } from "content-entry/src/content-entry.mjs";
import { StreamContentEntryMixin } from "content-entry/src/stream-content-entry-mixin.mjs";
import { Branch } from "repository-provider";
import { join } from "./util.mjs";
import micromatch from "micromatch";

export class GiteaBranch extends Branch {
  async *entries(patterns) {
    const url =
      join(
        this.provider.api,
        "repos",
        this.repository.fullName,
        "git/trees",
        await this.refId()
      ) + "?recursive=true";

    const result = await fetch(url, {
      headers: this.provider.headers,
      accept: "application/json"
    });

    const json = await result.json();

    for (const entry of json.tree) {
      if (
        patterns === undefined ||
        micromatch([entry.path], patterns).length === 1
      ) {
        switch (entry.type) {
          case "tree":
            yield new BaseCollectionEntry(entry.path);
            break;
          default:
            yield new GiteaContentEntry(this, entry.path);
        }
      }
    }
  }

  /**
   * Commit entries
   * @param {string} message commit message
   * @param {Entry[]} updates file content to be commited
   * @param {Object} options
   * @return {Promise}
   */
  async commit(message, updates, options) {
    for (const u of updates) {
      const result = await fetch(
        join(
          this.provider.api,
          "repos",
          this.repository.fullName,
          "contents",
          u.name
        ),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...this.provider.headers
          },
          body: JSON.stringify({
            message,
            branch: this.name,
            content: (await u.getBuffer()).toString("base64")
          })
        }
      );

      console.log(result.ok);
      console.log(await result.text());
    }
  }
}

class GiteaContentEntry extends StreamContentEntryMixin(ContentEntry) {
  constructor(branch, name) {
    super(name);
    Object.defineProperties(this, { branch: { value: branch } });
  }

  get provider() {
    return this.branch.provider;
  }

  async getReadStream(options) {
    const url = join(
      this.provider.api,
      "repos",
      this.branch.repository.fullName,
      "raw",
      this.name
    );
    const result = await fetch(url, {
      headers: this.provider.headers
    });

    return await result.body;
  }
}
