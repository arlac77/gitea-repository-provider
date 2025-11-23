import test from "ava";
import {
  assertRepo,
  createMessageDestination
} from "repository-provider-test-support";
import GiteaProvider from "gitea-repository-provider";

const messageDestination = createMessageDestination().messageDestination;

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
  "https://arlac77@bitbucket.org/arlac77/sync-test-repository.git": undefined,

  "https://mfelten.dynv6.net/services/git/markus/de.mfelten.consumption.git": {
    provider: GiteaProvider,
    fullName: "markus/de.mfelten.consumption",
    owner: owner1,
    isArchived: true,
    isTemplate: false
    // homePageURL: 'XX',
    //  isPrivate: false
  },
  "markus/Omnia": {
    provider: GiteaProvider,
    fullName: "markus/Omnia",
    owner: owner1
  },
  "https://mfelten.dynv6.net/services/git/github-mirror/gitea-repository-provider.git":
    {
      provider: GiteaProvider,
      fullName: "github-mirror/gitea-repository-provider",
      owner: owner6,
      isArchived: false
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
          "issue_assign",
          "issue_label",
          "issue_milestone",
          "issue_comment",
          "pull_request",
          "pull_request_assign",
          "pull_request_label",
          "pull_request_milestone",
          "pull_request_comment",
          "pull_request_review_approved",
          "pull_request_review_rejected",
          "pull_request_review_comment",
          "pull_request_review_request",
          "pull_request_sync",
          "wiki",
          "repository",
          "release",
          "package",
          "status",
          "wiki",
          "workflow_job",
          "workflow_run"
        ])
      }
    ]
  }
};

test("locate repository several", async t => {
  t.plan(38 /*42*/);

  const provider = GiteaProvider.initialize(
    { messageDestination },
    process.env
  );

  for (const [name, repoFixture] of Object.entries(repoFixtures)) {
    const repository = await provider.repository(name);
    await assertRepo(t, repository, repoFixture, name);
  }
});
