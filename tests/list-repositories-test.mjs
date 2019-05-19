import test from 'ava';
import { GiteaProvider } from '../src/gitea-provider';

const config = GiteaProvider.optionsFromEnvironment(process.env);

test('list repositories', async t => {
  const provider = new GiteaProvider(config);

  const rps = {};

  for await (const r of provider.repositories()) {
      rps[r.fullName] = r;
  }

  t.true(Object.keys(rps).length > 0)
});
