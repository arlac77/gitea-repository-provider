import {
  boolean_attribute,
  string_attribute,
  email_attribute,
  username_attribute
} from "pacc";
import { RepositoryGroup } from "repository-provider";

/**
 *
 */
export class GiteaOrganization extends RepositoryGroup {
  static attributes = {
    ...super.attributes,
    avatarURL: {
      ...RepositoryGroup.attributes.avatarURL,
      externalName: "avatar_url"
    },
    homePageURL: {
      ...RepositoryGroup.attributes.homePageURL,
      externalName: "website"
    },
    username: username_attribute,
    email: email_attribute,
    location: {...string_attribute, name: "location" },
    visibility: {...string_attribute, name: "visibility" },
    repo_admin_change_team_access: boolean_attribute, name: "repo_admin_change_team_access" }
  };
}
