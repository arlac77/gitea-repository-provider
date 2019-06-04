import test from "ava";
import { GiteaProvider } from "../src/gitea-provider";

const config = GiteaProvider.optionsFromEnvironment(process.env);

test("repository", async t => {
    const provider = new GiteaProvider(config);

    const repo = await provider.repository('markus/Omnia');
    const b = await repo.branches();

    t.is([b.keys].length, 1);

    console.log(await repo.refId('refs/heads/master'));
    console.log(await (await repo.defaultBranch).refId());
});
