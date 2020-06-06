import test from "ava";
import { pullRequestLivecycle, pullRequestList } from "repository-provider-test-support";
import GiteaProvider from "gitea-repository-provider";

const REPOSITORY_NAME =
  "https://mfelten.dynv6.net/services/git/markus/sync-test-repository.git";

test.skip("pr livecycle", async t => {
  await pullRequestLivecycle(
    t,
    GiteaProvider.initialize(undefined, process.env),
    REPOSITORY_NAME
  );
});

test.skip("pr list", async t => {
  await pullRequestList(
    t,
    GiteaProvider.initialize(undefined, process.env),
    REPOSITORY_NAME
  );
});
