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
    const { json } = await this.provider.fetchJSON(
      join("repos", this.repository.fullName, "git/trees", await this.refId) +
        "?recursive=true"
    );

    for (const entry of matcher(json.tree, patterns, {
      name: "path"
    })) {
      yield entry.type === "tree"
        ? new BaseCollectionEntry(entry.path)
        : new (this.name === "master"
            ? GiteaMasterOnlyContentEntry
            : GiteaContentEntry)(entry.path, parseInt(entry.mode, 8), this);
    }
  }

  async removeEntries(entries) {
    for await (const entry of entries) {
      await this.provider.fetch(
        `/repos/${this.repository.fullName}/contents/${entry.name}`,
        {
          method: "DELETE",
          body: JSON.stringify({ branch: this.name, message: "", sha: "" })
        }
      );
    }
  }

  async sha(path) {
    const { json } = await this.provider.fetchJSON(
      join("repos", this.repository.fullName, "contents", path) +
        "#" +
        this.name
    );

    return json.sha;
  }

  /**
   * Writes content into the branch.
   * @param {ConentEntry} entry
   * @param {String} message
   * @return {Promise<Entry>} written content with sha values set
   */
  async writeEntry(entry, message) {
    const data = {
      message,
      branch: this.name,
      content: (await entry.getBuffer()).toString("base64"),
      sha: await this.sha(entry.name)
    };

    const { json } = await this.provider.fetchJSON(
      join("repos", this.repository.fullName, "contents", entry.name),
      {
        method: "PUT",
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
      entries.map(entry => this.writeEntry(entry, message))
    );

    const data = updates;
    const { json } = await this.provider.fetchJSON(
      join("repos", this.repository.fullName, "git/trees/", updates.sha),
      {
        method: "PUT",
        body: JSON.stringify(data)
      }
    );

    return json;
  }
}

/**
 * works for all branches
 *
 */
class GiteaContentEntry extends BufferContentEntryMixin(ContentEntry) {
  constructor(name, mode, branch) {
    super(name);
    this.branch = branch;
    Object.defineProperty(this, "mode", { value: mode });
  }

  get provider() {
    return this.branch.provider;
  }

  get buffer() {
    return this.getBuffer();
  }

  async getBuffer() {
    const url = join(
      "repos",
      this.branch.repository.fullName,
      "contents",
      this.name + "?ref=" + this.branch.name
    );

    const result = await this.provider.fetch(url);

    const stream = await result.body;
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
  constructor(name, mode, branch) {
    super(name);
    this.branch = branch;
    Object.defineProperty(this, "mode", { value: mode });
  }

  get provider() {
    return this.branch.provider;
  }

  get readStream() {
    return this.getReadStream();
  }

  async getReadStream() {
    const url = join(
      "repos",
      this.branch.repository.fullName,
      "raw",
      this.name
    );
    const result = await this.provider.fetch(url);

    return await result.body;
  }
}