import { replaceWithOneTimeExecutionMethod } from "one-time-execution-method";
import {
  filterWritable,
  boolean_attribute,
  boolean_attribute_writable_false,
  url_attribute,
  empty_attribute,
  count_attribute,
  size_attribute,
  language_attribute,
  default_attribute,
  string_attribute
} from "pacc";
import { Repository } from "repository-provider";
import { join, headers } from "./util.mjs";
import { GiteaBranch } from "./gitea-branch.mjs";

/**
 * @see https://try.gitea.io/api/swagger#/repository/repoGet
 */
export class GiteaRepository extends Repository {
  static attributes = {
    ...super.attributes,
    size_attribute,
    language_attribute,
    allow_manual_merge: {
      ...boolean_attribute_writable_false,
      name: "allow_manual_merge"
    },
    allow_merge_commits: {
      ...boolean_attribute_writable_false,
      name: "allow_merge_commits"
    },
    allow_rebase: { ...boolean_attribute_writable_false, name: "allow_rebase" },
    allow_rebase_explicit: {
      ...boolean_attribute_writable_false,
      name: "allow_rebase_explicit"
    },
    allow_squash_merge: {
      ...boolean_attribute_writable_false,
      name: "allow_squash_merge"
    },
    autodetect_manual_merge: {
      ...boolean_attribute_writable_false,
      name: "autodetect_manual_merge"
    },
    ignore_whitespace_conflicts: {
      ...boolean_attribute_writable_false,
      name: "ignore_whitespace_conflicts"
    },
    default_delete_branch_after_merge: {
      ...boolean_attribute_writable_false,
      name: "default_delete_branch_after_merge"
    },
    default_merge_style: { ...boolean_attribute, name: "default_merge_style" },
    stars_count: { ...count_attribute, name: "stars_count" },
    ssh_url: { ...url_attribute, name: "ssh_url" },
    empty: empty_attribute,
    open_issues_count: { ...count_attribute, name: "open_issues_count" },
    open_pr_counter: { ...count_attribute, name: "open_pr_counter" },
    watchers_count: { ...count_attribute, name: "watchers_count" },
    release_counter: { ...count_attribute, name: "release_counter" },
    has_projects: { ...boolean_attribute, name: "has_projects" },
    has_pull_requests: { ...boolean_attribute, name: "has_pull_requests" },
    has_wiki: { ...boolean_attribute, name: "has_wiki" },
    forks_count: { ...count_attribute, name: "forks_count" },

    // creation only ?
    auto_init: { ...boolean_attribute, name: "auto_init" },
    license: { ...string_attribute, name: "license" },
    trust_model: { ...default_attribute, name: "trust_model" },
    readme: { ...string_attribute, name: "readme" },

    isMirror: {
      ...boolean_attribute_writable_false,
      name: "isMirror",
      externalName: "mirror"
    },
    homePageURL: { ...super.attributes.homePageURL, externalName: "website" }
  };

  fetch(path, options) {
    return this.provider.fetch(join("repos", this.fullName, path), options);
  }

  fetchJSON(path, options) {
    return this.provider.fetchJSON(join("repos", this.fullName, path), options);
  }

  /**
   * {@link https://try.gitea.io/api/swagger#/repository/repoEdit}
   */
  async update() {
    return this.fetch("", {
      method: "PATCH",
      headers,
      body: JSON.stringify(this.toJSON(filterWritable))
    });
  }

  async initializeBranches() {
    const { json } = await this.fetchJSON("branches");
    for (const bd of json) {
      this.addBranch(bd.name, bd);
    }
  }

  async createBranch(name, from, options) {
    const branch = await super.branch(name);

    if (branch) {
      return branch;
    }

    const body = {
      new_branch_name: name
    };

    if (from) {
      body.old_branch_name = from.name;
    }

    const { json } = await this.fetchJSON("branches", {
      method: "POST",
      body: JSON.stringify(body)
    });

    return this.addBranch(name, json);
  }

  async initializeHooks() {
    const { json } = await this.fetchJSON("hooks");

    for (const h of json) {
      this.addHook(h.id, {
        ...h,
        ...h.config
      });
    }
  }

  async refId(ref) {
    const { json } = await this.fetchJSON(`git/${ref}`);

    if (Array.isArray(json)) {
      return json[0].object.sha;
    }

    return json.object.sha;
  }

  get branchClass() {
    return GiteaBranch;
  }
}

replaceWithOneTimeExecutionMethod(
  GiteaRepository.prototype,
  "initializeBranches"
);
replaceWithOneTimeExecutionMethod(GiteaRepository.prototype, "initializeHooks");
replaceWithOneTimeExecutionMethod(
  GiteaRepository.prototype,
  "initializePullRequests"
);
