import fetch from "node-fetch";
import { matcher } from "matching-iterator";
import {
  BufferContentEntryMixin,
  StreamContentEntryMixin,
  ContentEntry,
  BaseCollectionEntry
} from "content-entry";
import { Branch } from "repository-provider";
import { join } from "./util.mjs";

/**
 *
 *
 */
export class GiteaBranch extends Branch {
  static get attributeMapping() {
    return {
      full_name: "displayName"
    };
  }

  async *entries(patterns) {
    const url = new URL(
      join("repos", this.repository.fullName, "git/trees", await this.refId()) +
        "?recursive=true",
      this.provider.api
    );

    const result = await fetch(url, {
      headers: this.provider.headers,
      accept: "application/json"
    });

    const json = await result.json();

    for (const entry of matcher(json.tree, patterns, {
      name: "path"
    })) {
      yield entry.type === "tree"
        ? new BaseCollectionEntry(entry.path)
        : new (this.name === "master"
            ? GiteaMasterOnlyContentEntry
            : GiteaContentEntry)(this, entry.path);
    }
  }

  async sha(path) {
    const result = await fetch(
      new URL(
        join("repos", this.repository.fullName, "contents", path) +
          "#" +
          this.name,
        this.provider.api
      )
    );

    const json = await result.json();

   // console.log(json);
    return json.sha;
  }

  /**
   * Commit entries
   * @param {string} message commit message
   * @param {Entry[]} updates file content to be commited
   * @param {Object} options
   * @return {Commit}
   */
  async commit(message, updates, options) {
    for (const u of updates) {
      const data = {
        message,
        branch: this.name,
        content: (await u.getBuffer()).toString("base64"),
        sha: await this.sha(u.name)
      };

      console.log(data);
   /*   console.log(
        join(
          this.provider.api,
          "repos",
          this.repository.fullName,
          "contents",
          u.name
        )
      );*/

      const result = await fetch(
        new URL(
          join("repos", this.repository.fullName, "contents", u.name),
          this.provider.api
        ),
        {
          method: "PUT",
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
    const url = new URL(
      join(
        "repos",
        this.branch.repository.fullName,
        "contents",
        this.name + "?ref=" + this.branch.name
      ),
      this.provider.api
    );

    const result = await fetch(url, {
      headers: this.provider.headers
    });

    const stream = await await result.body;
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    const entry = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    return Buffer.from(entry.content, "base64");
  }
}

/**
 * only works for master branch
 *
 */
class GiteaMasterOnlyContentEntry extends StreamContentEntryMixin(
  ContentEntry
) {
  constructor(branch, name) {
    super(name);
    Object.defineProperties(this, { branch: { value: branch } });
  }

  get provider() {
    return this.branch.provider;
  }

  async getReadStream(options) {
    const url = new URL(
      join("repos", this.branch.repository.fullName, "raw", this.name),
      this.provider.api
    );

    const result = await fetch(url, {
      headers: this.provider.headers
    });

    return await result.body;
  }
}
