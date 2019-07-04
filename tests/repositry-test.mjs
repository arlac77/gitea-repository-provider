import test from "ava";
import { GiteaProvider } from "../src/gitea-provider";

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
  }
};

function assertRepo(t, repository, fixture) {
  if (fixture === undefined) {
    t.is(repository, undefined);
  } else {
    t.is(repository.fullName, fixture.fullName);
    t.is(repository.owner.name, fixture.owner.name);
    t.is(repository.owner.id, fixture.owner.id);

    if (fixture.provider) {
      t.is(repository.provider.constructor, fixture.provider);
    }
  }
}

test("locate repository several", async t => {
  const provider = GiteaProvider.initialize(undefined, process.env);

  for (const rn of Object.keys(repoFixtures)) {
    const r = repoFixtures[rn];
    const repository = await provider.repository(rn);
    assertRepo(t, repository, repoFixtures[rn]);
  }
});
