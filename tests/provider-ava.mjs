import test from "ava";
import {
  providerTest,
  createMessageDestination
} from "repository-provider-test-support";
import GiteaProvider from "gitea-repository-provider";

const messageDestination = createMessageDestination().messageDestination;

test("factory name", t => t.is(GiteaProvider.name, "gitea"));

test(providerTest, new GiteaProvider());

const config = {
  token: "123456",
  api: "https://mydomain.com/gitea/api/v1/"
};

test("provider constructor", t => {
  const provider = new GiteaProvider(config);
  t.is(provider.token, "123456");
  t.is(provider.api, "https://mydomain.com/gitea/api/v1/");
  t.deepEqual(provider.repositoryBases, [
    "gitea:",
    "https://mydomain.com/gitea/"
  ]);
});

test("initialize", t => {
  let provider = GiteaProvider.initialize(
    { messageDestination },
    {
      GITEA_TOKEN: "123456",
      GITEA_API: "https://mydomain.com/gitea/api/v1"
    }
  );
  t.is(provider.name, "gitea");
  t.is(provider.api, "https://mydomain.com/gitea/api/v1/");
  t.deepEqual(provider.repositoryBases, [
    "gitea:",
    "https://mydomain.com/gitea/"
  ]);
  t.is(provider.token, "123456");

  provider = GiteaProvider.initialize(
    { messageDestination },
    {
      GITEA_TOKEN: "123456"
    }
  );
  t.is(provider, undefined);
});
