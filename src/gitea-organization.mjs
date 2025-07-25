import { boolean_attribute, default_attribute, username_attribute } from "pacc";
import { RepositoryGroup } from "repository-provider";

/**
 *
 */
export class GiteaOrganization extends RepositoryGroup {
  static attributes = {
    ...super.attributes,
    username: username_attribute,
    location: default_attribute,
    visibility: default_attribute,
    repo_admin_change_team_access: boolean_attribute
  };

  static attributeMapping = {
    avatar_url: "avatarURL",
    website: "homePageURL"
  };
}
