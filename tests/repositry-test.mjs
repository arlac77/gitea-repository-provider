import test from "ava";
import { GiteaProvider } from "../src/gitea-provider";

const config = GiteaProvider.optionsFromEnvironment(process.env);

test("repository short", async t => {
    const provider = new GiteaProvider(config);

    const repo = await provider.repository('markus/Omnia');
    const b = await repo.branches();

    t.is([b.keys].length, 1);
});

test("repository from url", async t => {
    const provider = new GiteaProvider(config);
    const repo = await provider.repository('https://mfelten.dynv6.net/services/git/markus/de.mfelten.consumption.git');
    t.is(repo.fullName, 'markus/de.mfelten.consumption');
});
