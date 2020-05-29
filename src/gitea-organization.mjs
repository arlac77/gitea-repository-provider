import { RepositoryGroup } from "repository-provider";

/**
 *
 */
export class GiteaOrganization extends RepositoryGroup {
  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      username: undefined,
      avatar_url: undefined,
      website: undefined,
      location: undefined,
      visibility: undefined
    };
  }
}
