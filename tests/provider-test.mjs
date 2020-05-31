import test from "ava";
import { providerTest } from "repository-provider-test-support";
import { GiteaProvider } from "gitea-repository-provider";

test(providerTest, new GiteaProvider());

const config = GiteaProvider.optionsFromEnvironment({
  GITEA_TOKEN: "123456",
  GITEA_API: "http://mydomain.com/gitea/v1/"
});

test("provider env options", t => {
  t.deepEqual(config, {
    token: "123456",
    api: "http://mydomain.com/gitea/v1/"
  });
});

test("provider constructor", t => {
  const provider = new GiteaProvider(config);

  t.is(provider.token, "123456");
  t.is(provider.api, "http://mydomain.com/gitea/v1/");
});

test("initialize", t => {
  let provider = GiteaProvider.initialize(undefined, {
    GITEA_TOKEN: "123456",
    GITEA_API: "http://mydomain.com/gitea/v1/"
  });
  t.is(provider.name, "GiteaProvider");

  provider = GiteaProvider.initialize(undefined, {
    GITEA_TOKEN: "123456"
  });
  t.is(provider, undefined);
});
