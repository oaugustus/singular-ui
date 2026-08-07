(function () {
  'use strict';

  // Portado de github.com/nuxt/ui v4.10.0, MIT License, Copyright (c) Nuxt Labs
  // Upstream: theme/sidebar.ts — 13 slots + variants side/collapsible/variant/transition
  // + compoundVariants (arrays OR via geTv). Slot rail no tema para safelist/API
  // futura; não renderizado nesta tarefa (§6). Overlay mobile omitido (Etapa 4).
  // Tailwind v3: w-(--x) → w-[var(--x)]; divide/border/ring-default →
  // [var(--ui-border)]; text-highlighted/muted → tokens; --spacing(N) → rem;
  // rail hover after: --ui-border-accented. Propriedades lógicas (start/end/
  // border-e/s) mantidas (Tailwind 3.4 do projeto).
  angular.module('gravityElements.layout').constant('geSidebarTheme', {
    slots: {
      root: 'peer [--sidebar-width:16rem] [--sidebar-width-icon:4rem]',
      gap: 'relative w-[var(--sidebar-width)] bg-transparent',
      container:
        'fixed inset-y-0 z-10 hidden h-svh w-[var(--sidebar-width)] lg:flex',
      inner:
        'flex size-full flex-col overflow-hidden divide-y divide-[var(--ui-border)]',
      header:
        'flex items-center gap-1.5 overflow-hidden px-4 min-h-[var(--ui-header-height)]',
      wrapper: 'min-w-0 flex-1',
      title: 'text-[var(--ui-text-highlighted)] font-semibold truncate',
      description: 'text-[var(--ui-text-muted)] text-sm truncate',
      actions: 'flex items-center gap-1.5 shrink-0',
      close: '',
      body: 'flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4',
      footer: 'flex items-center gap-1.5 overflow-hidden p-4',
      rail:
        'absolute inset-y-0 z-20 hidden w-4 after:absolute after:inset-y-0 after:left-1/2 after:w-px lg:flex hover:after:bg-[var(--ui-border-accented)] after:transition-colors',
    },
    variants: {
      transition: {
        true: {
          gap: 'transition-[width] duration-200 ease-out',
          container:
            'transition-[inset-inline-start,inset-inline-end,width] duration-200 ease-out',
          rail: 'transition-all ease-out',
        },
      },
      side: {
        left: {
          container: 'start-0 border-e border-[var(--ui-border)]',
          rail: 'end-0 translate-x-1/2 rtl:-translate-x-1/2',
        },
        right: {
          container: 'end-0 border-s border-[var(--ui-border)]',
          rail: '-start-px -translate-x-1/2 rtl:translate-x-1/2',
        },
      },
      collapsible: {
        offcanvas: {
          root: 'group/sidebar hidden lg:block',
          gap: 'data-[state=collapsed]:w-0',
        },
        icon: {
          root: 'group/sidebar hidden lg:block',
          gap: 'data-[state=collapsed]:w-[var(--sidebar-width-icon)]',
          container: 'data-[state=collapsed]:w-[var(--sidebar-width-icon)]',
          actions: 'group-data-[state=collapsed]/sidebar:hidden',
          body: 'group-data-[state=collapsed]/sidebar:overflow-hidden',
        },
        none: {
          root: 'h-full w-[var(--sidebar-width)]',
        },
      },
      variant: {
        sidebar: {},
        floating: {
          container: 'p-4 border-transparent',
          inner: 'rounded-lg ring ring-[var(--ui-border)] shadow-lg',
          rail: 'inset-y-4',
        },
        inset: {
          container: 'py-4 border-transparent',
          inner: 'divide-transparent',
          rail: 'inset-y-4',
        },
      },
    },
    compoundVariants: [
      {
        side: 'left',
        collapsible: ['offcanvas', 'icon'],
        class: {
          rail:
            'cursor-w-resize rtl:cursor-e-resize data-[state=collapsed]:cursor-e-resize data-[state=collapsed]:rtl:cursor-w-resize',
        },
      },
      {
        side: 'right',
        collapsible: ['offcanvas', 'icon'],
        class: {
          rail:
            'cursor-e-resize rtl:cursor-w-resize data-[state=collapsed]:cursor-w-resize data-[state=collapsed]:rtl:cursor-e-resize',
        },
      },
      {
        side: 'left',
        collapsible: 'none',
        class: {
          root: 'border-e border-[var(--ui-border)]',
        },
      },
      {
        side: 'right',
        collapsible: 'none',
        class: {
          root: 'border-s border-[var(--ui-border)]',
        },
      },
      {
        side: 'left',
        collapsible: 'offcanvas',
        class: {
          container:
            'data-[state=collapsed]:-start-[var(--sidebar-width)]',
        },
      },
      {
        side: 'right',
        collapsible: 'offcanvas',
        class: {
          container: 'data-[state=collapsed]:-end-[var(--sidebar-width)]',
        },
      },
      {
        variant: 'floating',
        collapsible: 'icon',
        class: {
          gap: 'data-[state=collapsed]:w-[calc(var(--sidebar-width-icon)+2rem)]',
          container:
            'data-[state=collapsed]:w-[calc(var(--sidebar-width-icon)+2rem+2px)]',
        },
      },
      {
        variant: 'floating',
        collapsible: 'none',
        class: {
          root: 'p-4 border-0',
        },
      },
      {
        variant: 'inset',
        collapsible: 'none',
        class: {
          root: 'py-4 border-0',
        },
      },
      {
        variant: 'floating',
        side: 'left',
        class: {
          rail: 'end-4',
        },
      },
      {
        variant: 'floating',
        side: 'right',
        class: {
          rail: 'start-[calc(1rem-1px)]',
        },
      },
    ],
    defaultVariants: {
      side: 'left',
      collapsible: 'none',
      variant: 'sidebar',
      transition: true,
    },
  });
})();
