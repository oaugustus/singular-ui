(function () {
  'use strict';

  // Portado de github.com/nuxt/ui v4.10.0, MIT License, Copyright (c) Nuxt Labs
  // Upstream: theme/header.ts — slots da barra estática apenas.
  // Omitidos (menu mobile / Overlay Etapa 4, §5.4.2): toggle, content,
  // overlay, header, body + variants.toggleSide.
  // Tailwind v3: bg-default/75 → color-mix com --ui-bg; border-default →
  // border-[var(--ui-border)]; text-highlighted → text-[var(--ui-text-highlighted)];
  // h-(--ui-header-height) → h-[var(--ui-header-height)].
  angular.module('gravityElements.layout').constant('geHeaderTheme', {
    slots: {
      root:
        'bg-[color:color-mix(in_srgb,var(--ui-bg)_75%,transparent)] backdrop-blur border-b border-[var(--ui-border)] h-[var(--ui-header-height)] sticky top-0 z-50',
      container: 'flex items-center justify-between gap-3 h-full',
      left: 'lg:flex-1 flex items-center gap-1.5',
      center: 'hidden lg:flex',
      right: 'flex items-center justify-end lg:flex-1 gap-1.5',
      title:
        'shrink-0 font-bold text-xl text-[var(--ui-text-highlighted)] flex items-end gap-1.5',
    },
  });
})();
