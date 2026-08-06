(function () {
  'use strict';

  /**
   * geContainer — wrapper de centralização/padding (Layout).
   *
   * Paridade com Nuxt UI Container v4.10.0 (theme/container.ts). Binding `size`
   * (`@`, opcional) é extensão Gravity (§6) para largura máxima; omitido usa
   * `--ui-container`. Transclusion do conteúdo.
   *
   * @param {string} [vm.size] - 'sm' | 'md' | 'lg' | 'xl' | '2xl'
   */
  angular.module('gravityElements.layout').component('geContainer', {
    template: '<div class="{{ vm.classes.base }}" ng-transclude></div>',
    controllerAs: 'vm',
    transclude: true,
    bindings: {
      size: '@',
    },
    controller: ContainerController,
  });

  ContainerController.$inject = ['geTv', 'geContainerTheme'];

  function ContainerController(geTv, geContainerTheme) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      vm.classes = geTv(geContainerTheme)({
        size: vm.size,
      });
    }
  }
})();
