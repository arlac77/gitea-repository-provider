import fetch from "node-fetch";
import micromatch from "micromatch";
import { BufferContentEntryMixin, StreamContentEntryMixin, ContentEntry, BaseCollectionEntry } from "content-entry";
import { Branch } from "repository-provider";
import { join } from "./util.mjs";

/**
 *
 *
 */
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
            yield new (this.name === 'master' ? GiteaMasterOnlyContentEntry : GiteaContentEntry)(this, entry.path);
           // yield new GiteaContentEntry(this, entry.path);
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
      const data = {
        message,
        branch: this.name,
        content: (await u.getBuffer()).toString("base64")
      };

      console.log(data);
      console.log(
        join(
          this.provider.api,
          "repos",
          this.repository.fullName,
          "contents",
          u.name
        )
      );

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
          body: JSON.stringify(data)
        }
      );

      console.log(result.ok, result.status, result.statusText);
      console.log(await result.text());
    }
  }
}

/**
 * works for all branches
 *
 */
class GiteaContentEntry extends BufferContentEntryMixin(ContentEntry) {
  constructor(branch, name) {
    super(name);
    Object.defineProperties(this, { branch: { value: branch } });
  }

  get provider() {
    return this.branch.provider;
  }

  async getBuffer() {
    const url = join(
      this.provider.api,
      "repos",
      this.branch.repository.fullName,
      "contents",
      this.name  + "?ref="+this.branch.name
    );

    const result = await fetch(url, {
      headers: this.provider.headers
    });

    const stream = await await result.body;
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    const entry = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    return Buffer.from(entry.content, 'base64');
  }

}

/**
 * only works for master branch
 *
 */
class GiteaMasterOnlyContentEntry extends StreamContentEntryMixin(ContentEntry) {
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
