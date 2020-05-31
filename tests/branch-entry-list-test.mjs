import test from "ava";
import { entryListTest } from "repository-provider-test-support";
import { GiteaProvider } from "gitea-repository-provider";

const REPOSITORY_NAME = "https://mfelten.dynv6.net/services/git/markus/sync-test-repository";

const config = GiteaProvider.optionsFromEnvironment(process.env);

test("branch entries list", async t => {
  const provider = new GiteaProvider(config);
  const repository = await provider.repository(REPOSITORY_NAME);
  const branch = await repository.branch("master");
  await entryListTest(t, branch, undefined, {
    "README.md": { startsWith: "fil" },
    "tests/rollup.config.js": { startsWith: "import babel" },
    tests: { isCollection: true },
    "a/b/c/file.txt": { startsWith: "file content" }
  });
});

test("branch entries list with pattern", async t => {
  const provider = new GiteaProvider(config);
  const repository = await provider.repository(REPOSITORY_NAME);
  const branch = await repository.branch("master");

  await entryListTest(t, branch, ["**/*.mjs", "!tests/*.mjs"], {
    "tests/repository-test.mjs": { notPresent: true },
    "src/repository.mjs": { startsWith: "import" }
  });
});
