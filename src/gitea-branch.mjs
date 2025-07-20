import { matcher } from "matching-iterator";
import {
  StreamContentEntry,
  BufferContentEntry,
  ContentEntry,
  CollectionEntry
} from "content-entry";
import { boolean_attribute, count_attribute, default_attribute } from "pacc";
import { Branch, CommitResult } from "repository-provider";
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
  static get attributes() {
    return {
      ...super.attributes,
      user_can_merge: boolean_attribute,
      user_can_push: boolean_attribute,
      required_approvals: count_attribute,
      enable_status_check: boolean_attribute,
      effective_branch_protection_name: default_attribute
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
      const options = { mode: entry.mode };

      yield entry.type === "tree"
        ? new CollectionEntry(entry.path, options)
        : this.name === "master"
        ? new StreamContentEntry(entry.path, options, async entry => {
            const url = join(
              "repos",
              this.repository.fullName,
              "raw",
              entry.name
            );
            const result = await this.provider.fetch(url);
            return result.body;
          })
        : new BufferContentEntry(entry.path, options, async entry => {
            const url = join(
              "repos",
              this.repository.fullName,
              "contents",
              entry.name + "?ref=" + this.name
            );

            const result = await this.provider.fetch(url);
            const body = await result.json();
            return Buffer.from(body.content, "base64");
          });
    }
  }

  async removeEntries(entries) {
    for await (const entry of entries) {
      await this.provider.fetch(
        join("repos", this.repository.fullName, "contents", entry.name),
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

    //console.log("SHA", json);
    return json.sha;
  }

  /**
   * Writes content into the branch.
   * @param {ContentEntry} entry
   * @param {string} message
   * @return {Promise<ContentEntry>} written content with sha values set
   */
  async writeEntry(entry, message) {
    const buffer = await entry.buffer;
    const decoder = new TextDecoder("utf8");
    const content = btoa(decoder.decode(buffer));

    const date = new Date();
    const body = JSON.stringify({
      message,
      branch: this.name,
      content,
      sha: await this.sha(entry.name),
      dates: {
        committer: date.toISOString()
      }
    });

    const { json, response } = await this.provider.fetchJSON(
      join("repos", this.repository.fullName, "contents", entry.name),
      {
        method: "PUT",
        body
      }
    );

    if (!response.ok) {
      console.error(body);
      throw new Error(response.statusText);
    }

    entry.sha = json.sha;
    return entry;
  }

  /**
   * Commit entries.
   * @param {string} message commit message
   * @param {ContentEntry[]} entries content to be commited
   * @param {Object} [options]
   * @return {Promise<CommitResult>}
   */
  async commit(message, entries, options) {
    const updates = await Promise.all(
      entries.map(entry => this.writeEntry(entry, message))
    );

    // TODO hack
    return {
      ref: `refs/heads/${this.name}`
    };
  }
}
