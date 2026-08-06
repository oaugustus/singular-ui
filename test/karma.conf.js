'use strict';

module.exports = function (config) {
  config.set({
    basePath: '..',
    frameworks: ['jasmine'],
    files: [
      'node_modules/@floating-ui/core/dist/floating-ui.core.umd.js',
      'node_modules/@floating-ui/dom/dist/floating-ui.dom.umd.js',
      'node_modules/tabbable/dist/index.umd.js',
      'node_modules/focus-trap/dist/focus-trap.umd.js',
      'node_modules/mousetrap/mousetrap.js',

      'test/shims/cjs-exports-prelude.js',
      'node_modules/tailwind-merge/dist/bundle-cjs.js',
      'test/shims/tw-merge-export.js',
      'test/shims/tailwind-variants.iife.js',
      'test/shims/tv-export.js',
      'node_modules/angular/angular.js',
      'node_modules/angular-aria/angular-aria.js',
      'node_modules/angular-animate/angular-animate.js',
      // core.module.js antes dos services — color-mode/ vem antes alfabeticamente
      'src/core/core.module.js',
      'src/core/tv/**/*.js',
      'src/core/overlay/**/*.js',
      'src/core/color-mode/**/*.js',
      'src/core/id/**/*.js',
      'src/gravity-elements.module.js',
      'test/fixtures/theme.fixture.js',
      'test/fixtures/class-normalize.js',
      'test/smoke/badge/smoke.module.js',
      'test/smoke/badge/badge.theme.js',
      'test/smoke/badge/badge.component.js',
      'test/**/*.spec.js',
    ],
    exclude: ['src/index.js'],
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
