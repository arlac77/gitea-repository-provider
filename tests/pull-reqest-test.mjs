import test from "ava";
import { pullRequestLivecycle } from "./util.mjs";
import { GiteaProvider } from "../src/gitea-provider.mjs";

const TEST_REPO =
  "https://mfelten.dynv6.net/services/git/markus/sync-test-repository.git";

test("list pull requests", async t => {
  const provider = GiteaProvider.initialize(undefined, process.env);

  const repository = await provider.repository(TEST_REPO);

  const prs = [];

  for await (const pr of repository.pullRequests()) {
    prs.push(pr);
  }

  t.true(prs.length > 0);
});

test("pull request livecycle", async t => {
  await pullRequestLivecycle(
    t,
    GiteaProvider.initialize(undefined, process.env),
    TEST_REPO
  );
});
