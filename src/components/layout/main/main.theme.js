(function () {
  'use strict';

  // Portado de github.com/nuxt/ui v4.10.0, MIT License, Copyright (c) Nuxt Labs
  // Upstream: theme/main.ts — base top-level normalizado para slots.base (geTv).
  // Classe já TW3-compatível (min-h-[calc(...)]); sem adaptação adicional.
  angular.module('gravityElements.layout').constant('geMainTheme', {
    slots: {
      base: 'min-h-[calc(100vh-var(--ui-header-height))]',
    },
  });
})();
