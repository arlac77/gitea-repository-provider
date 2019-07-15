import { generateBranchName } from "repository-provider";
import { StringContentEntry } from "content-entry";

export async function assertRepo(t, repository, fixture, url) {
  t.log(url);
  if (fixture === undefined) {
    t.is(repository, undefined);
  } else {
    if (fixture.name !== undefined) {
      t.is(repository.name, fixture.name);
    }

    if (fixture.fullName !== undefined) {
      t.is(repository.fullName, fixture.fullName);
    }

    if (fixture.condensedName !== undefined) {
      t.is(repository.condensedName, fixture.condensedName);
    }

    if (fixture.description !== undefined) {
      t.is(repository.description, fixture.description);
    }

    if (fixture.uuid !== undefined) {
      t.is(repository.uuid, fixture.uuid);
    }

    if (fixture.id !== undefined) {
      t.is(repository.id, fixture.id);
    }

    if (fixture.owner) {
      if (fixture.owner.name !== undefined) {
        t.is(repository.owner.name, fixture.owner.name);
      }

      if (fixture.owner.id !== undefined) {
        t.is(repository.owner.id, fixture.owner.id);
      }
      if (fixture.owner.uuid !== undefined) {
        t.is(repository.owner.uuid, fixture.owner.uuid);
      }
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

  const commit = await source.commit("message text", [
    new StringContentEntry("README.md", `file content #${name}`)
  ]);

  const pr = await provider.pullRequestClass.open(source, destination, {
    title: `test pr from ${name}`,
    body: "this is the body\n- a\n- b\n- c"
  });

  t.is(pr.source, source);
  t.is(pr.destination, destination);
  t.true(pr.number !== undefined);

  t.is(pr.title, `test pr from ${name}`);
  t.is(pr.body, "this is the body\n- a\n- b\n- c");
  t.is(pr.state, "OPEN");
  t.is(pr.locked, false);
  t.is(pr.merged, false);

  for await (const p of provider.pullRequestClass.list(repository)) {
    console.log("LIST", p, pr.equals(p));
  }

  //await pr.decline();
  await source.delete();
}

export async function assertCommit(t, repository, entryName = "README.md") {
  const branchName = await generateBranchName(repository, "commit-test/*");
  const branch = await repository.createBranch(branchName);
  try {
    const commit = await branch.commit("message text", [
      new StringContentEntry(entryName, `file content #${branchName}`)
    ]);

    t.is(commit.ref, `refs/heads/${branchName}`);
  } finally {
    await repository.deleteBranch(branchName);
  }
}
