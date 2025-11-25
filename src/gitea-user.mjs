import {
  default_attribute,
  language_attribute,
  username_attribute,
  email_attribute
} from "pacc";
import { RepositoryGroup } from "repository-provider";

/**
 *
 */
export class GiteaUser extends RepositoryGroup {
  static attributes = {
    ...super.attributes,
    login: default_attribute,
    email: email_attribute,
    username: username_attribute,
    language: language_attribute
  };
}
