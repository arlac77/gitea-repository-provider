import test from "ava";
import { groupListTest } from "repository-provider-test-support";
import { GiteaProvider } from "../src/gitea-provider.mjs";

const provider = GiteaProvider.initialize(undefined, process.env);

const fullResult = {
  markus: { name: "markus", username: "markus" },
  "github-mirror": { description: "github.com mirror" }
};

test(groupListTest, provider, undefined, fullResult);
test.serial("2nd. time", groupListTest, provider, undefined, fullResult);
test.serial(groupListTest, provider, "*", fullResult);
test.serial(groupListTest, provider, "markus", {
  markus: { name: "markus", username: "markus" }
});
