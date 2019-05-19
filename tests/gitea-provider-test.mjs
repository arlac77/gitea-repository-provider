import test from "ava";
import { GiteaProvider } from "../src/gitea-provider";

const config = GiteaProvider.optionsFromEnvironment({
  GITEA_TOKEN: "123456",
  GITEA_API: "http://mydomain.com/gitea/v1/"
});

test("provider constructor", async t => {
  const provider = new GiteaProvider(config);

  t.is(provider.token, "123456");
  t.is(provider.api, "http://mydomain.com/gitea/v1/");
});
