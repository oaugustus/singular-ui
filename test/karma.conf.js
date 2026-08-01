'use strict';

module.exports = function (config) {
  config.set({
    basePath: '..',
    frameworks: ['jasmine'],
    files: [
      'test/shims/cjs-exports-prelude.js',
      'node_modules/tailwind-merge/dist/bundle-cjs.js',
      'test/shims/tw-merge-export.js',
      'test/shims/tailwind-variants.iife.js',
      'test/shims/tv-export.js',
      'src/**/*.js',
      'test/fixtures/theme.fixture.js',
      'test/fixtures/class-normalize.js',
      'test/**/*.spec.js',
    ],
    exclude: [],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    concurrency: Infinity,
  });
};
