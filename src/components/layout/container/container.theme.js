(function () {
  'use strict';

  // Portado de github.com/nuxt/ui v4.10.0, MIT License, Copyright (c) Nuxt Labs
  // Upstream: theme/container.ts — base top-level normalizado para slots.base (geTv).
  // Tailwind v3: max-w-(--ui-container) → max-w-[var(--ui-container)].
  // variants.size é extensão Gravity (§6); Nuxt UI v4.10.0 Container não tem prop size.
  angular.module('gravityElements.layout').constant('geContainerTheme', {
    slots: {
      base: 'w-full max-w-[var(--ui-container)] mx-auto px-4 sm:px-6 lg:px-8',
    },
    variants: {
      size: {
        sm: { base: 'max-w-screen-sm' },
        md: { base: 'max-w-screen-md' },
        lg: { base: 'max-w-screen-lg' },
        xl: { base: 'max-w-screen-xl' },
        '2xl': { base: 'max-w-screen-2xl' },
      },
    },
  });
})();
