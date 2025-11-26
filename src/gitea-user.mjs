import { default_attribute, language_attribute } from "pacc";
import { GiteaOrganization } from "./gitea-organization.mjs";

/**
 *
 */
export class GiteaUser extends GiteaOrganization {
  static attributes = {
    ...super.attributes,
    login: default_attribute,
    language: language_attribute
  };

  /*
  active
created
followers_count
following_count
html_url
is_admin
language
last_login
login
login_name
prohibit_login
restricted
source_id
starred_repos_count
*/
}
