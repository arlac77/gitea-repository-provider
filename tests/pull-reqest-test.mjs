import test from "ava";
import { GiteaProvider } from "../src/gitea-provider.mjs";

test("list pull requests", async t => {
  const provider = GiteaProvider.initialize(undefined, process.env);

  const repository = await provider.repository(
    "https://mfelten.dynv6.net/services/git/markus/sync-test-repository.git"
  );

  const prs = [];

  for await (const pr of repository.pullRequests()) {
    prs.push(pr);
  }

  t.true(prs.length > 0);
});
