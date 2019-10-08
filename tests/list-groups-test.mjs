import test from "ava";
import { listGroupsTest } from "repository-provider-test-support";
import { GiteaProvider } from "../src/gitea-provider.mjs";


test(
  listGroupsTest,
  GiteaProvider.initialize(undefined, process.env),
  undefined,
  { markus: { name: "markus", username: "markus" },
  "github-mirror": { description: "github.com mirror" }  }
);
