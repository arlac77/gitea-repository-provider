import fetch from "node-fetch";
import { Branch } from "repository-provider";
import { join } from "./util.mjs";

export class GiteaBranch extends Branch {
  async *entries(patterns) {
    await this.refId();
  }
}
