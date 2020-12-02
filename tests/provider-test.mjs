import test from "ava";
import { providerTest } from "repository-provider-test-support";
import GiteaProvider from "gitea-repository-provider";

test("factory name", t => t.is(GiteaProvider.name, "gitea"));

test(providerTest, new GiteaProvider());

const config = GiteaProvider.optionsFromEnvironment({
  GITEA_TOKEN: "123456",
  GITEA_API: "http://mydomain.com/gitea/api/v1/"
});

test("provider env options", t => {
  t.deepEqual(config, {
    token: "123456",
    api: "http://mydomain.com/gitea/api/v1/"
  });
});

test("provider constructor", t => {
  const provider = new GiteaProvider(config);
  t.is(provider.token, "123456");
  t.is(provider.api, "http://mydomain.com/gitea/api/v1/");
  t.deepEqual(provider.repositoryBases, [
    "gitea:",
    "http://mydomain.com/gitea/"
  ]);
});

test("initialize", t => {
  let provider = GiteaProvider.initialize(undefined, {
    GITEA_TOKEN: "123456",
    GITEA_API: "http://mydomain.com/gitea/api/v1"
  });
  t.is(provider.name, "gitea");
  t.is(provider.api, "http://mydomain.com/gitea/api/v1/");
  t.deepEqual(provider.repositoryBases, [
    "gitea:",
    "http://mydomain.com/gitea/"
  ]);
  t.is(provider.token, "123456");

  provider = GiteaProvider.initialize(undefined, {
    GITEA_TOKEN: "123456"
  });
  t.is(provider, undefined);
});
