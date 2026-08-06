'use strict';

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  globals: {
    angular: 'readonly',
    FloatingUIDOM: 'readonly',
  },
  extends: ['eslint:recommended', 'plugin:angular/johnpapa'],
  rules: {
    // Spec Y070: <feature>.<tipo>.js (ex. tv.service.js), não o nome do artefato Angular
    'angular/file-name': 'off',
  },
  overrides: [
    {
      files: ['**/*.spec.js'],
      env: {
        jasmine: true,
      },
      globals: {
        geTv: 'readonly',
        twMerge: 'readonly',
        tv: 'readonly',
        geTvFixtureTheme: 'readonly',
        geTvFixtureCases: 'readonly',
        normalizeClasses: 'readonly',
      },
      rules: {
        // Specs exercitam a API global / DOM sem $window/$document/$timeout
        'angular/window-service': 'off',
        'angular/document-service': 'off',
        'angular/timeout-service': 'off',
      },
    },
    {
      files: ['src/core/tv/tv.service.js'],
      rules: {
        // geTv é testável sem Angular; expõe API em globalThis/window
        'angular/window-service': 'off',
      },
    },
    {
      files: ['test/shims/**/*.js'],
      rules: {
        'angular/window-service': 'off',
        'no-redeclare': 'off',
        'no-unused-vars': 'off',
        'no-var': 'off',
      },
    },
    {
      files: ['test/fixtures/**/*.js'],
      rules: {
        'angular/window-service': 'off',
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
    {
      files: ['src/index.js'],
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2021,
      },
    },
  ],
};
