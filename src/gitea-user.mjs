import { RepositoryGroup } from "repository-provider";

/**
 *
 */
export class GiteaUser extends RepositoryGroup {
  static get attributes() {
    return {
      ...super.attributes,
      login: undefined,
      email: undefined,
      username: undefined,
      language: undefined
    };
  }

  static get attributeMapping() {
    return {
      ...super.attributeMapping,
      avatar_url: "avatarURL"
    };
  }
}
