import { RepositoryGroup } from "repository-provider";

/**
 *
 */
export class GiteaOrganization extends RepositoryGroup {
  static get attributes() {
    return {
      ...super.attributes,
      username: {},
      location: {},
      visibility: {}
    };
  }

  static get attributeMapping() {
    return {
      avatar_url: "avatarURL",
      website: "homePageURL"
    };
  }

}
