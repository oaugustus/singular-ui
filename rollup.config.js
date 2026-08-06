'use strict';

const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

/** @type {import('rollup').RollupOptions} */
module.exports = {
  input: 'src/index.js',
  external: ['angular'],
  output: {
    file: 'dist/gravity-elements.umd.js',
    format: 'umd',
    name: 'gravityElements',
    globals: {
      angular: 'angular',
    },
    sourcemap: true,
  },
  plugins: [
    resolve({ browser: true }),
    commonjs({ include: /node_modules/ }),
  ],
};
