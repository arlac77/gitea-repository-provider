import test from "ava";
import { assertRepo } from "./util.mjs";
import { GiteaProvider } from "../src/gitea-provider.mjs";

const owner1 = {
  name: "markus",
  id: 1
};
const owner6 = {
  name: "github-mirror",
  id: 6
};

const repoFixtures = {
  "git@mfelten.de/github-repository-provider.git": undefined,
  "http://www.heise.de/index.html": undefined,

  "git@bitbucket.org:arlac77/sync-test-repository.git": undefined,

  "https://mfelten.dynv6.net/services/git/markus/de.mfelten.consumption.git": {
    provider: GiteaProvider,
    fullName: "markus/de.mfelten.consumption",
    owner: owner1
  },
  "markus/Omnia": {
    provider: GiteaProvider,
    fullName: "markus/Omnia",
    owner: owner1
  },
  "https://mfelten.dynv6.net/services/git/github-mirror/gitea-repository-provider.git": {
    provider: GiteaProvider,
    fullName: "github-mirror/gitea-repository-provider",
    owner: owner6
  },
  "https://mfelten.dynv6.net/services/git/markus/de.mfelten.archlinux.git": {
    provider: GiteaProvider,
    fullName: "markus/de.mfelten.archlinux",
    owner: owner1,
    hooks: [
      {
        id: 3,
        active: true,
        url: "https://mfelten.dynv6.net/services/ci/api/gitea",
        events: new Set([
          "create",
          "delete",
          "fork",
          "push",
          "issues",
          "issue_comment",
          "pull_request",
          "repository",
          "release"
        ])
      }
    ]
  }
};

test("locate repository several", async t => {
  const provider = GiteaProvider.initialize(undefined, process.env);

  for (const rn of Object.keys(repoFixtures)) {
    const repository = await provider.repository(rn);
    await assertRepo(t, repository, repoFixtures[rn], rn);
  }
});
