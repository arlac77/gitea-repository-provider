import { RepositoryGroup } from "repository-provider";

/**
 *
 */
export class GiteaOrganization extends RepositoryGroup {
  static get attributes() {
    return {
      ...super.attributes,
      username: undefined,
      avatar_url: undefined,
      website: undefined,
      location: undefined,
      visibility: undefined
    };
  }
}
