(function () {
  'use strict';

  angular.module('gravityElements.smoke').constant('geBadgeTheme', {
    slots: {
      base: 'inline-flex rounded',
    },
    variants: {
      color: {
        primary: { base: 'bg-primary text-white' },
        neutral: { base: 'bg-neutral text-black' },
      },
    },
    defaultVariants: {
      color: 'primary',
    },
  });
})();
