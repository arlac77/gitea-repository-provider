import test from "ava";
import {
  branchListTest,
  createMessageDestination
} from "repository-provider-test-support";
import GiteaProvider from "gitea-repository-provider";

const messageDestination = createMessageDestination().messageDestination;

const provider = GiteaProvider.initialize({ messageDestination }, process.env);

test(branchListTest, provider, "bad-name/unknown-*");
test(branchListTest, provider, "arlac77/*repository-provider");
test(branchListTest, provider, "github-mirror/*repository-provider", 7);
test(branchListTest, provider, "github-mirror/repository-provider", {
  "github-mirror/repository-provider": {
    fullCondensedName: "github-mirror/repository-provider"
  }
});
