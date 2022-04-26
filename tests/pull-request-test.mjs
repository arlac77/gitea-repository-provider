import test from "ava";
import { pullRequestLivecycle, pullRequestList, createMessageDestination } from "repository-provider-test-support";
import GiteaProvider from "gitea-repository-provider";

const messageDestination = createMessageDestination().messageDestination;

const REPOSITORY_NAME =
  "https://mfelten.dynv6.net/services/git/markus/sync-test-repository.git";

test.skip("pr livecycle", async t => {
  await pullRequestLivecycle(
    t,
    GiteaProvider.initialize({messageDestination}, process.env),
    REPOSITORY_NAME
  );
});

test.skip("pr list", async t => {
  await pullRequestList(
    t,
    GiteaProvider.initialize({messageDestination}, process.env),
    REPOSITORY_NAME
  );
});
