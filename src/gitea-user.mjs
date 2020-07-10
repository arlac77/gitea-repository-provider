import { RepositoryGroup } from "repository-provider";

/**
 *
 */
export class GiteaUser extends RepositoryGroup {
  static get attributes() {
    return {
      ...super.attributes,
      login: { type: "string" },
      email: { type: "string" },
      username: { type: "string" },
      language: { type: "string" }
    };
  }

  static get attributeMapping() {
    return {
      ...super.attributeMapping,
      avatar_url: "avatarURL"
    };
  }
}
