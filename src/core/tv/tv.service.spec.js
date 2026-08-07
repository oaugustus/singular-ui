'use strict';

describe('geTv', function () {
  var theme;
  var resolve;

  beforeEach(function () {
    theme = {
      slots: {
        base: 'inline-flex items-center',
        label: 'truncate',
      },
      variants: {
        color: {
          primary: { base: 'text-primary', label: 'font-medium' },
          neutral: { base: 'text-neutral', label: 'font-normal' },
        },
        size: {
          sm: { base: 'text-xs gap-1', label: 'text-xs' },
          md: { base: 'text-sm gap-1.5', label: 'text-sm' },
        },
      },
      compoundVariants: [
        {
          color: 'primary',
          size: 'md',
          class: 'bg-primary ring-1',
        },
      ],
      defaultVariants: {
        color: 'primary',
        size: 'md',
      },
    };
    resolve = geTv(theme);
  });

  it('aplica defaultVariants quando props está vazio', function () {
    var classes = resolve({});

    expect(classes.base).toBe(
      twMerge('inline-flex items-center text-primary text-sm gap-1.5 bg-primary ring-1')
    );
    expect(classes.label).toBe(
      twMerge('truncate font-medium text-sm')
    );
  });

  it('sobrescreve uma variante com props explícitos', function () {
    var classes = resolve({ color: 'neutral' });

    expect(classes.base).toBe(
      twMerge('inline-flex items-center text-neutral text-sm gap-1.5')
    );
    expect(classes.label).toBe(
      twMerge('truncate font-normal text-sm')
    );
  });

  it('ativa compoundVariants quando as condições batem', function () {
    var classes = resolve({ color: 'primary', size: 'md' });

    expect(classes.base).toContain('bg-primary');
    expect(classes.base).toContain('ring-1');
    expect(classes.base).toBe(
      twMerge('inline-flex items-center text-primary text-sm gap-1.5 bg-primary ring-1')
    );
  });

  it('não ativa compoundVariants quando as condições não batem', function () {
    var classes = resolve({ color: 'primary', size: 'sm' });

    expect(classes.base).not.toContain('bg-primary');
    expect(classes.base).not.toContain('ring-1');
    expect(classes.base).toBe(
      twMerge('inline-flex items-center text-primary text-xs gap-1')
    );
    expect(classes.label).toBe(
      twMerge('truncate font-medium text-xs')
    );
  });

  it('ativa compoundVariants quando a condição é array e o valor está na lista', function () {
    var arrayTheme = {
      slots: {
        rail: 'absolute inset-y-0',
      },
      variants: {
        side: {
          left: { rail: 'end-0' },
          right: { rail: 'start-0' },
        },
        collapsible: {
          offcanvas: {},
          icon: {},
          none: {},
        },
      },
      compoundVariants: [
        {
          side: 'left',
          collapsible: ['offcanvas', 'icon'],
          class: {
            rail: 'cursor-w-resize',
          },
        },
      ],
      defaultVariants: {
        side: 'left',
        collapsible: 'offcanvas',
      },
    };
    var arrayResolve = geTv(arrayTheme);

    expect(arrayResolve({ collapsible: 'offcanvas' }).rail).toContain(
      'cursor-w-resize'
    );
    expect(arrayResolve({ collapsible: 'icon' }).rail).toContain(
      'cursor-w-resize'
    );
  });

  it('não ativa compoundVariants com array quando o valor não está na lista', function () {
    var arrayTheme = {
      slots: {
        rail: 'absolute inset-y-0',
      },
      variants: {
        side: {
          left: { rail: 'end-0' },
        },
        collapsible: {
          offcanvas: {},
          icon: {},
          none: {},
        },
      },
      compoundVariants: [
        {
          side: 'left',
          collapsible: ['offcanvas', 'icon'],
          class: {
            rail: 'cursor-w-resize',
          },
        },
      ],
      defaultVariants: {
        side: 'left',
        collapsible: 'none',
      },
    };
    var arrayResolve = geTv(arrayTheme);
    var classes = arrayResolve({ collapsible: 'none' });

    expect(classes.rail).not.toContain('cursor-w-resize');
    expect(classes.rail).toBe(twMerge('absolute inset-y-0 end-0'));
  });
});
