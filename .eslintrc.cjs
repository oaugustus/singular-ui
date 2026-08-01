'use strict';

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  globals: {
    angular: 'readonly',
  },
  extends: ['eslint:recommended', 'plugin:angular/johnpapa'],
  overrides: [
    {
      files: ['**/*.spec.js'],
      env: {
        jasmine: true,
      },
    },
    {
      files: [
        'scripts/**/*.js',
        'test/karma.conf.js',
        'rollup.config.js',
        '*.config.js',
      ],
      env: {
        node: true,
      },
    },
  ],
};
