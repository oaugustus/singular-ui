(function () {
  'use strict';

  angular.module('gravityElements.smoke').component('geBadge', {
    template: '<span class="{{ vm.classes.base }}" ng-bind="vm.label"></span>',
    controllerAs: 'vm',
    bindings: {
      label: '@',
      color: '@',
    },
    controller: BadgeController,
  });

  BadgeController.$inject = ['geTv', 'geBadgeTheme'];

  function BadgeController(geTv, geBadgeTheme) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      vm.classes = geTv(geBadgeTheme)({
        color: vm.color,
      });
    }
  }
})();
