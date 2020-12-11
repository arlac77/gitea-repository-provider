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

  async removeEntries(entries) {
    for await (const entry of entries) {
      await fetch(
        new URL(
          `/repos/${this.repository.fullName}/contents/${entry.name}`,
          this.provider.api
        ),
        {
          method: "DELETE",
          body: JSON.stringify({ branch: this.name, message: "", sha: "" })
        }
      );
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

    return json.sha;
  }

  /**
   * Writes content into the branch
   * @param {ConentEntry} entry
   * @return {Promise<Entry>} written content with sha values set
   */
  async writeEntry(entry) {
    const data = {
      message,
      branch: this.name,
      content: (await entry.getBuffer()).toString("base64"),
      sha: await this.sha(entry.name)
    };

    const result = await fetch(
      new URL(
        join("repos", this.repository.fullName, "contents", entry.name),
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

    entry.sha = json.sha;
    return entry;
  }

  /**
   * Commit entries.
   * @param {string} message commit message
   * @param {ContentEntry[]} entries content to be commited
   * @param {Object} options
   * @return {Commit}
   */
  async commit(message, entries, options) {
    const updates = await Promise.all(
      entries.map(entry => this.writeEntry(entry))
    );

    const result = await fetch(
      new URL(
        join("repos", this.repository.fullName, "git/trees/",updates.sha),
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
