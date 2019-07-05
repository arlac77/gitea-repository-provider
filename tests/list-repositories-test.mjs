import test from "ava";
import { GiteaProvider } from "../src/gitea-provider.mjs";

test("list repositories", async t => {
  const provider = GiteaProvider.initialize(undefined, process.env);

  let rps = {};

  for await (const r of provider.repositories()) {
    //console.log(r.fullName);

    rps[r.fullName] = r;
  }

  t.true(Object.keys(rps).length > 0);
  t.is(rps['markus/Omnia'].fullName,'markus/Omnia');

   rps = {};

  for await (const r of provider.repositories(['markus/*'])) {
    rps[r.fullName] = r;
  }

  t.true(Object.keys(rps).length > 0);
  t.is(rps['markus/Omnia'].fullName,'markus/Omnia');
});
