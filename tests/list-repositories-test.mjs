import test from "ava";
import { assertRepo } from "repository-provider-test-support";
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

test("list repositories", async t => {
  const provider = GiteaProvider.initialize(undefined, process.env);

  let rps = {};

  for await (const r of provider.repositories()) {
    //console.log(r.fullName);

    rps[r.fullName] = r;
  }

  t.true(Object.keys(rps).length > 0);
  t.is(rps["markus/Omnia"].fullName, "markus/Omnia");

  rps = {};

  for await (const r of provider.repositories(["markus/*"])) {
    rps[r.fullName] = r;
  }

  t.true(Object.keys(rps).length > 0);
  t.is(rps["markus/Omnia"].fullName, "markus/Omnia");
});
