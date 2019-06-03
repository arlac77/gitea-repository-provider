import test from "ava";
import { GiteaProvider } from "../src/gitea-provider";

const config = GiteaProvider.optionsFromEnvironment(process.env);

test("repository", async t => {
    const provider = new GiteaProvider(config);

    const r = await provider.repository('markus/Omnia');

    const b = await r.branches();

    t.is([b.keys].length, 1);
});
