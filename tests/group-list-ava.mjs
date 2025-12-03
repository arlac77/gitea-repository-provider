import test from "ava";
import { groupListTest, createMessageDestination } from "repository-provider-test-support";
import GiteaProvider from "gitea-repository-provider";

const messageDestination = createMessageDestination().messageDestination;
const provider = GiteaProvider.initialize({ messageDestination}, process.env);

const markusGroup = {
  markus: { id: 1, name: "markus", username: "markus", language: "", is_admin: false }
};
const githubMirrorGroup = {
  "github-mirror": { id: 6, description: "mirror of github.com" }
};

const allGroups = {
  ...markusGroup,
  ...githubMirrorGroup
};

test(groupListTest, provider, undefined, allGroups);
test("2nd. time", groupListTest, provider, undefined, allGroups);
test(groupListTest, provider, "*", allGroups);
test(groupListTest, provider, provider.repositoryBases[0] + "*", allGroups);
test(groupListTest, provider, "markus", markusGroup);
test(
  groupListTest,
  provider,
  provider.repositoryBases[0] + "markus",
  markusGroup
);
test(groupListTest, provider, "https://invalid/gitea", 0);
