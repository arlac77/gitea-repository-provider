import test from "ava";
import { listGroupsTest } from "repository-provider-test-support";
import { GiteaProvider } from "../src/gitea-provider.mjs";

const provider = GiteaProvider.initialize(undefined, process.env);

const fullResult = {
  markus: { name: "markus", username: "markus" },
  "github-mirror": { description: "github.com mirror" }
};

test(listGroupsTest, provider, undefined, fullResult);
test.serial("2nd. time", listGroupsTest, provider, undefined, fullResult);
test.serial(listGroupsTest, provider, "*", fullResult);
test.serial(listGroupsTest, provider, "markus", {
  markus: { name: "markus", username: "markus" }
});
