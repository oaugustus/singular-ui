(function () {
  'use strict';

  // Portado de github.com/nuxt/ui v4.10.0, MIT License, Copyright (c) Nuxt Labs
  // Upstream: theme/error.ts — slots sem variants.
  // Tailwind v3: text-primary / text-highlighted / text-muted (tokens semânticos
  // Nuxt UI v4) → text-[var(--ui-primary)] / text-[var(--ui-text-highlighted)] /
  // text-[var(--ui-text-muted)]. Vars definidas em src/styles/gravity-elements.css.
  angular.module('gravityElements.layout').constant('geErrorTheme', {
    slots: {
      root: 'min-h-[calc(100vh-var(--ui-header-height))] flex flex-col items-center justify-center text-center',
      leading: 'mb-4 flex items-center justify-center',
      leadingIcon: 'size-10 shrink-0 text-[var(--ui-primary)]',
      statusCode: 'text-base font-semibold text-[var(--ui-primary)]',
      statusMessage:
        'mt-2 text-4xl sm:text-5xl font-bold text-[var(--ui-text-highlighted)] text-balance',
      message: 'mt-4 text-lg text-[var(--ui-text-muted)] text-balance',
      links: 'mt-8 flex items-center justify-center gap-6',
    },
  });
})();
