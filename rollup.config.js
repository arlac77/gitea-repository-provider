import cleanup from 'rollup-plugin-cleanup';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import executable from 'rollup-plugin-executable';
import pkg from './package.json';

export default [
  ...Object.keys(pkg.bin || {}).map(name => {
    return {
      input: `src/${name}.js`,
      output: {
        file: pkg.bin[name],
        format: 'cjs',
        banner: '#!/usr/bin/env node',
        interop: false
      },
      plugins: [resolve(), commonjs(), executable()]
    };
  }),
  {
    input: pkg.module,
    output: {
      file: pkg.main,
      format: 'cjs',
      interop: false
    },
    plugins: [resolve(), commonjs()]
  }
];
