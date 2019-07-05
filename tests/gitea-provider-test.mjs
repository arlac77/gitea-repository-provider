import test from "ava";
import { GiteaProvider } from "../src/gitea-provider.mjs";

const config = GiteaProvider.optionsFromEnvironment({
  GITEA_TOKEN: "123456",
  GITEA_API: "http://mydomain.com/gitea/v1/"
});

test("provider env options", t => {
  t.deepEqual(config, { token: '123456', api: "http://mydomain.com/gitea/v1/" });
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
  t.is(provider.name, 'GiteaProvider');

  provider = GiteaProvider.initialize(undefined, {
    GITEA_TOKEN: "123456",
  });
  t.is(provider, undefined);
});

test("get undefined repo", async t => {
  const provider = new GiteaProvider(config);

  const repository = await provider.repository();

  t.is(repository, undefined)
});
