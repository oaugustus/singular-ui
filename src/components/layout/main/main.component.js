(function () {
  'use strict';

  /**
   * geMain — wrapper semântico de conteúdo principal (Layout).
   *
   * Paridade com Nuxt UI Main v4.10.0 (theme/main.ts + Main.vue):
   * renderiza <main> com altura mínima da viewport menos --ui-header-height.
   * Sem bindings (§6); props Vue `as`/`ui`/`class` não portadas.
   * Transclusion do conteúdo.
   */
  angular.module('gravityElements.layout').component('geMain', {
    template: '<main class="{{ vm.classes.base }}" ng-transclude></main>',
    controllerAs: 'vm',
    transclude: true,
    controller: MainController,
  });

  MainController.$inject = ['geTv', 'geMainTheme'];

  function MainController(geTv, geMainTheme) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      vm.classes = geTv(geMainTheme)({});
    }
  }
})();
