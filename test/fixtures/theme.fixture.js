'use strict';

window.suTvFixtureTheme = {
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
    block: {
      true: { base: 'w-full justify-center' },
    },
  },
  compoundVariants: [
    {
      color: 'primary',
      size: 'md',
      class: 'bg-primary ring-1',
    },
    {
      color: 'neutral',
      size: 'sm',
      class: {
        base: 'border border-neutral',
        label: 'uppercase',
      },
    },
  ],
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
};

window.suTvFixtureCases = [
  { name: 'defaults vazios', props: {} },
  { name: 'override color neutral', props: { color: 'neutral' } },
  { name: 'compound string on (primary+md)', props: { color: 'primary', size: 'md' } },
  { name: 'compound string off (primary+sm)', props: { color: 'primary', size: 'sm' } },
  { name: 'compound object on (neutral+sm)', props: { color: 'neutral', size: 'sm' } },
  { name: 'boolean block true', props: { block: true } },
];
