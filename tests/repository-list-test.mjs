import test from "ava";
import {
  assertRepo,
  repositoryListTest
} from "repository-provider-test-support";
import { GiteaProvider } from "../src/gitea-provider.mjs";

const repoFixtures = {
  "": undefined,
  " ": undefined,
  "https://mfelten.dynv6.net/services/git/markus/de.mfelten.archlinux.git": {
    branch: "master",
    fullName: "markus/de.mfelten.archlinux",
    description: "infrasctucture build on arch linux (arm)",
    provider: GiteaProvider
  },
  "https://mfelten.dynv6.net/services/git/markus/de.mfelten.archlinux": {
    branch: "master",
    fullName: "markus/de.mfelten.archlinux",
    description: "infrasctucture build on arch linux (arm)",
    provider: GiteaProvider
  },
  "https://mfelten.dynv6.net/services/git/markus/de.mfelten.archlinux#master": {
    branch: "master",
    fullName: "markus/de.mfelten.archlinux",
    provider: GiteaProvider
  },
  "markus/de.mfelten.archlinux#master": {
    branch: "master",
    fullName: "markus/de.mfelten.archlinux",
    description: "infrasctucture build on arch linux (arm)",
    provider: GiteaProvider
  },

  "arlac77/aggregation-repository-provider": {
    /*   branch: "master",
    fullName: "arlac77/aggregation-repository-provider"*/
  }
};

test("locate repository several", async t => {
  const provider = GiteaProvider.initialize(undefined, process.env);

  t.plan(13);

  for (const rn of Object.keys(repoFixtures)) {
    const repository = await provider.repository(rn);
    await assertRepo(t, repository, repoFixtures[rn], rn);
  }
});

const provider = GiteaProvider.initialize(undefined, process.env);
const fullResult = {
  Omnia: {
    fullName: "markus/Omnia"
  }
};

test.serial(repositoryListTest, provider, "markus/Omnia", fullResult);
test.serial(repositoryListTest, provider, "markus/*", fullResult);
test.serial(repositoryListTest, provider, "*", fullResult);
test.serial(repositoryListTest, provider, undefined, fullResult);

