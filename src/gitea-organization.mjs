import { RepositoryGroup, boolean_attribute } from "repository-provider";

/**
 *
 */
export class GiteaOrganization extends RepositoryGroup {
  static get attributes() {
    return {
      ...super.attributes,
      username: { type: "string" },
      location: { type: "string" },
      visibility: { type: "string" },
      repo_admin_change_team_access: boolean_attribute
    };
  }

  static get attributeMapping() {
    return {
      avatar_url: "avatarURL",
      website: "homePageURL"
    };
  }
}
