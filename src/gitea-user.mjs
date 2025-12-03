import { default_attribute, language_attribute, count_attribute, boolean_attribute_writable } from "pacc";
import { GiteaOrganization } from "./gitea-organization.mjs";

/**
 *
 */
export class GiteaUser extends GiteaOrganization {
  static attributes = {
    ...super.attributes,
    login: default_attribute,
    language: language_attribute,
    starred_repos_count: count_attribute,
    is_admin: boolean_attribute_writable
  };

  /*
  active
created
followers_count
following_count
html_url
last_login
login_name
prohibit_login
restricted
source_id
*/
}
