import test from "ava";
import { GiteaProvider } from "../src/gitea-provider";

const config = GiteaProvider.optionsFromEnvironment(process.env);

test("branch", async t => {
    const provider = new GiteaProvider(config);

    const repo = await provider.repository('markus/Omnia');

    const b = await repo.defaultBranch;

    const entries = {};

    for await (const e of b.entries()) {
        entries[e.name] = e;
    }

    t.is(entries.Makefile.name, 'Makefile');

    const stream = await entries.Makefile.getReadStream();

    let c = '';

    for await (const chunk of stream) {
        c += chunk;
    }

    //console.log(c);
    t.regex(c, /buildLib/);

    //stream.pipe(process.stdout);

});