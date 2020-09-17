import test from "ava";
import { assertCommit } from "repository-provider-test-support";
import GiteaProvider from "gitea-repository-provider";

const entryFixtures = {
  ".gitignore": { startsWith: "out" },
  Makefile: { startsWith: "CPPOPTIONS := -O3 -std=c++1y -stdlib=libc++" },
  test: { isCollection: true }
};

async function checkEntry(t, entry, fixture) {
  if (fixture.isCollection) {
    t.true(entry.isCollection);
  } else {
    t.true(
      (await entry.getString()).startsWith(fixture.startsWith),
      "getStream"
    );

    const stream = await entry.getReadStream();
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    const all = Buffer.concat(chunks);

    t.true(
      all.toString("utf8").startsWith(fixture.startsWith),
      "getReadStream"
    );
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

test("branch entry master", async t => {
  const provider = GiteaProvider.initialize(undefined, process.env);
  const branch = await provider.branch("markus/Omnia");

  const entry = await branch.entry("Makefile");
  await checkEntry(t, entry, entryFixtures.Makefile);
});

test("branch entry none master", async t => {
  const provider = GiteaProvider.initialize(undefined, process.env);
  const branch = await provider.branch(
    "markus/sync-test-repository#pr-source-1"
  );

  const entry = await branch.entry("README.md");

  await checkEntry(t, entry, { startsWith: "# pr-source-1" });
});

test.skip("branch commmit", async t => {
  const provider = GiteaProvider.initialize(undefined, process.env);

  await assertCommit(
    t,
    await provider.repository(
      "https://mfelten.dynv6.net/services/git/markus/sync-test-repository.git"
    )
  );
});
