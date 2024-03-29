import test from "ava";
import {
  assertRepo,
  repositoryListTest,
  createMessageDestination
} from "repository-provider-test-support";
import GiteaProvider from "gitea-repository-provider";

const messageDestination = createMessageDestination().messageDestination;

const repoFixtures = {
  "": undefined,
  " ": undefined,
  "https://mfelten.dynv6.net/services/git/markus/de.mfelten.archlinux.git": {
    branch: "master",
    fullName: "markus/de.mfelten.archlinux",
    description: "infrastructure build on arch linux (arm)",
    provider: GiteaProvider
  },

  "https://mfelten.dynv6.net/services/git/markus/de.mfelten.archlinux": {
    branch: "master",
    fullName: "markus/de.mfelten.archlinux",
    description: "infrastructure build on arch linux (arm)",
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
    description: "infrastructure build on arch linux (arm)",
    provider: GiteaProvider,
    isFork: false
  },

  "arlac77/aggregation-repository-provider": undefined
  /*
  {
       branch: "master",
    fullName: "arlac77/aggregation-repository-provider"
  }*/
};

test("locate repository several", async t => {
  const provider = GiteaProvider.initialize(
    { messageDestination },
    process.env
  );

  t.plan(27);

  for (const [name, repoFixture] of Object.entries(repoFixtures)) {
    const repository = await provider.repository(name);
    await assertRepo(t, repository, repoFixture, name);
  }
});

const provider = GiteaProvider.initialize({ messageDestination }, process.env);
const fullResult = {
  "markus/Omnia": {
    name: "Omnia"
  }
};

test(repositoryListTest, provider, "markus/Omnia", fullResult);
test(repositoryListTest, provider, "markus/*", fullResult);
test(
  repositoryListTest,
  provider,
  "https://mfelten.dynv6.net/services/git/markus/*",
  fullResult
);
test(repositoryListTest, provider, "*", fullResult);
test(repositoryListTest, provider, undefined, fullResult);
