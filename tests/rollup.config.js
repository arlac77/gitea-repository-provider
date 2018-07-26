import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import multiEntry from 'rollup-plugin-multi-entry';
import istanbul from 'rollup-plugin-istanbul';

export default {
  input: 'tests/**/*-test.js',
  output: {
    file: 'build/bundle-test.js',
    format: 'cjs',
    sourcemap: true,
    interop: false
  },
  external: ['ava'],
  plugins: [
    multiEntry(),
    istanbul({
      exclude: ['tests/**/*-test.js']
    }),
    resolve(),
    commonjs()
  ]
};
