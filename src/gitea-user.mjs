import { default_attribute, language_attribute, username_attribute } from "pacc";
import { RepositoryGroup } from "repository-provider";

/**
 *
 */
export class GiteaUser extends RepositoryGroup {
  static get attributes() {
    return {
      ...super.attributes,
      login: default_attribute,
      email: default_attribute,
      username: username_attribute,
      language: language_attribute
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
