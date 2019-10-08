import { RepositoryGroup } from "repository-provider";

/**
 *
 */
export class GiteaUser extends RepositoryGroup {
  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      login: undefined,
      language: undefined,
      email: undefined,
      full_name: undefined,
      avatar_url: undefined,
      username: undefined
    };
  }
}
