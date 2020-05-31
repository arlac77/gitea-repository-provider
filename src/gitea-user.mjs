import { RepositoryGroup } from "repository-provider";

/**
 *
 */
export class GiteaUser extends RepositoryGroup {
  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      login: undefined,
      email: undefined,
      username: undefined,
      avatar_url: undefined,
      language: undefined,
    };
  }

  static get attributeMapping() {
    return {
      ...super.attributeMapping,
      avatar_url: "avatarURL" };
  }

}
