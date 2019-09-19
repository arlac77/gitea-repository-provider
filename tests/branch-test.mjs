import test from "ava";
import { assertCommit } from "repository-provider-test-support";
import { GiteaProvider } from "../src/gitea-provider.mjs";

const entryFixtures = {
  ".gitignore": { startsWith: "out" },
  Makefile: { startsWith: "CPPOPTIONS := -O3 -std=c++1y -stdlib=libc++" },
  test: { isCollection: true }
};

async function checkEntry(t, entry, fixture) {
  if (fixture.isCollection) {
    t.true(entry.isCollection);
  } else {
    t.true((await entry.getString()).startsWith(fixture.startsWith));

    const stream = await entry.getReadStream();
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    t.true(chunks.join().startsWith(fixture.startsWith));
  }
}

test("branch list entries", async t => {
  const provider = GiteaProvider.initialize(undefined, process.env);
  const branch = await provider.branch("markus/Omnia");

  t.plan(Object.keys(entryFixtures).length + 2);

  for await (const entry of branch.entries()) {
    const ef = entryFixtures[entry.name];

    if (ef !== undefined) {
      await checkEntry(t, entry, ef);
    }
  }
});

test("branch list entries filtered", async t => {
  const provider = GiteaProvider.initialize(undefined, process.env);
  const branch = await provider.branch("markus/Omnia");

  t.plan(1);

  for await (const entry of branch.entries("Makefile")) {
    t.is(entry.name, "Makefile");
  }
});

test("branch entry", async t => {
  const provider = GiteaProvider.initialize(undefined, process.env);
  const branch = await provider.branch("markus/Omnia");

  const entry = await branch.entry("Makefile");
  await checkEntry(t, entry, entryFixtures.Makefile);
});

test.skip("branch commmit", async t => {
  const provider = GiteaProvider.initialize(undefined, process.env);

  await assertCommit(t,
    await provider.repository("https://mfelten.dynv6.net/services/git/markus/sync-test-repository.git"));
});
