import { generateBranchName } from "repository-provider";

export async function assertRepo(t, repository, fixture) {
  if (fixture === undefined) {
    t.is(repository, undefined);
  } else {
    t.is(repository.fullName, fixture.fullName);

    if (fixture.owner) {
      t.is(repository.owner.name, fixture.owner.name);
      t.is(repository.owner.id, fixture.owner.id);
    }

    if (fixture.hooks) {
      for await (const h of repository.hooks()) {
        const fh = fixture.hooks.find(x => x.id === h.id);
        if (fh) {
          t.is(h.id, fh.id);
          t.is(h.url, fh.url);
          t.is(h.active, fh.active);
          t.deepEqual(h.events, fh.events);
        }
      }
    }

    if (fixture.provider) {
      t.is(repository.provider.constructor, fixture.provider);
    }
  }
}

export async function pullRequestLivecycle(t, provider, repoName) {
  const repository = await provider.repository(repoName);

  const name = await generateBranchName(repository, "pr-test/*");

  const destination = await repository.defaultBranch;
  const source = await destination.createBranch(name);

  const pr = await provider.pullRequestClass.open(source, destination, {
    title: "a test pr",
    body: "this is the body"
  });

  t.is(pr.title, "a test pr");
  t.is(pr.body, "this is the body");
  t.is(pr.state, "OPEN");

  for await (p of provider.pullRequestClasss.list(destination)) {
    console.log(p, pr.equals(p));
  }

  await pr.decline();
}
