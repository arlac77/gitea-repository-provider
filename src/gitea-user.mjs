import { RepositoryGroup, default_attribute } from "repository-provider";

/**
 *
 */
export class GiteaUser extends RepositoryGroup {
  static get attributes() {
    return {
      ...super.attributes,
      login: default_attribute,
      email: default_attribute,
      username: default_attribute,
      language: default_attribute
    };
  }

  static get attributeMapping() {
    return {
      ...super.attributeMapping,
      avatar_url: "avatarURL",
      is_admin: "isAdmin"
    };
  }
}
