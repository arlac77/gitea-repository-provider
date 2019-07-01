import test from "ava";
import { GiteaProvider } from "../src/gitea-provider";

const entryFixtures = {
    '.gitignore': { startsWith: "out" },
    Makefile: { startsWith: "CPPOPTIONS := -O3 -std=c++1y -stdlib=libc++" },
    test: { isCollection: true }
};

test("branch", async t => {
  const provider = GiteaProvider.initialize(undefined, process.env);
  const repo = await provider.repository("markus/Omnia");
  const branch = await repo.defaultBranch;

  t.plan(Object.keys(entryFixtures).length + 2);

  for await (const entry of branch.entries()) {
    const ef = entryFixtures[entry.name];

    if (ef !== undefined) {
      if (ef.isCollection) {
        t.true(entry.isCollection);
      } else {
        t.true((await entry.getString()).startsWith(ef.startsWith));

        const stream = await entry.getReadStream();
        const chunks = [];
        for await (const chunk of stream) {
          chunks.push(chunk);
        }
        t.true(chunks.join().startsWith(ef.startsWith));
      }
    }
  }
});
