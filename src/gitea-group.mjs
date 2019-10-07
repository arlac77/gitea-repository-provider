import fetch from "node-fetch";
import {
  RepositoryGroup,
  definePropertiesFromOptions
} from "repository-provider";
import { join } from "./util.mjs";

/**
 * represents either a user or an org
 *
 */
export class GiteaGroup extends RepositoryGroup {
  async _initialize() {
    await this.fetchDetails();
  }

  async fetchDetails() {
    const options = {
        headers: this.provider.headers,
        accept: "application/json"
      };

    let result = await fetch(join(this.provider.api, "orgs", this.name), options);

    if (!result.ok) {
      console.log(join(this.provider.api, "users", this.name));
      result = await fetch(join(this.provider.api, "users", this.name), options);
    }

    const data = await result.json();
    definePropertiesFromOptions(this, data);
  }
}
