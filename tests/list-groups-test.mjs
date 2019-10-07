import test from "ava";
import { GiteaProvider } from "../src/gitea-provider.mjs";

test("list groups", async t => {
  const provider = GiteaProvider.initialize(undefined, process.env);

  let rgs = {};

  for await (const g of provider.repositoryGroups()) {
    //console.log(g.name);

    rgs[g.name] = g;
  }

  t.true(Object.keys(rgs).length > 0);
  t.is(rgs['markus'].name,'markus');
});
