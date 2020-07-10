import { RepositoryGroup } from "repository-provider";

/**
 *
 */
export class GiteaOrganization extends RepositoryGroup {
  static get attributes() {
    return {
      ...super.attributes,
      username: { type: "string" },
      location: { type: "string" },
      visibility: { type: "string" }
    };
  }

  static get attributeMapping() {
    return {
      avatar_url: "avatarURL",
      website: "homePageURL"
    };
  }

}
