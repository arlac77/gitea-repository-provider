import { Provider, Repository, Branch } from 'repository-provider';

/**
 * Gitea provider
 *
 */
export class GiteaProvider extends Provider {
  /**
   * provide token from one of
   * - GITEA_TOKEN
   * @param {Object} env process env
   * @return {Object} with auth token
   */
  static optionsFromEnvironment(env) {
    const token = env.GITEA_TOKEN;
    return token === undefined ? undefined : { auth: token };
  }
}
