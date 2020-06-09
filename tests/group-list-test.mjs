import test from "ava";
import { groupListTest } from "repository-provider-test-support";
import GiteaProvider from "gitea-repository-provider";

const provider = GiteaProvider.initialize(undefined, process.env);

const fullResult = {
  markus: { name: "markus", username: "markus" },
  "github-mirror": { description: "mirror of github.com" }
};

test(groupListTest, provider, undefined, fullResult);
test("2nd. time", groupListTest, provider, undefined, fullResult);
test(groupListTest, provider, "*", fullResult);
test(groupListTest, provider, "markus", {
  markus: { name: "markus", username: "markus" }
});
