import test from "ava";
import {
  entryListTest,
  createMessageDestination
} from "repository-provider-test-support";
import GiteaProvider from "gitea-repository-provider";

const REPOSITORY_NAME =
  "https://mfelten.dynv6.net/services/git/markus/sync-test-repository";

const messageDestination = createMessageDestination().messageDestination;

test("branch entries list", async t => {
  const provider = GiteaProvider.initialize(
    { messageDestination },
    process.env
  );

  const repository = await provider.repository(REPOSITORY_NAME);
  const branch = await repository.branch("master");
  await entryListTest(t, branch, undefined, {
    "README.md": { startsWith: "fil", mode: 0o100644 },
    "tests/rollup.config.js": { startsWith: "import babel", mode: 0o100644 },
    tests: { isCollection: true },
    "a/b/c/file.txt": { startsWith: "file content", mode: 0o100644 }
  });
});

test("branch entries list with pattern", async t => {
  const provider = GiteaProvider.initialize(
    { messageDestination },
    process.env
  );

  const repository = await provider.repository(REPOSITORY_NAME);
  const branch = await repository.branch("master");

  await entryListTest(t, branch, ["**/*.mjs", "!tests/*.mjs"], {
    "tests/repository-test.mjs": { notPresent: true },
    "src/repository.mjs": { startsWith: "import" }
  });
});
