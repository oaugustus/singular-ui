(function () {
  'use strict';

  /**
   * geApp — stub da Etapa 1 (Layout).
   *
   * Nuxt UI v4.10.0: App.vue é só provedor (ConfigProvider / Tooltip / Toaster /
   * Overlay); não existe theme/app.ts — por isso não há app.theme.js (exceção §5).
   * Papel completo de provedor (Toast/overlays programáticos) fica para a Etapa 4.
   *
   * Sem bindings próprios. Transclusion do conteúdo raiz; no $onInit aplica o
   * modo persistido de geColorMode quando o serviço estiver disponível.
   */
  angular.module('gravityElements.layout').component('geApp', {
    template: '<div ng-transclude></div>',
    controllerAs: 'vm',
    transclude: true,
    controller: AppController,
  });

  AppController.$inject = ['$injector'];

  function AppController($injector) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      if (!$injector.has('geColorMode')) {
        return;
      }
      var geColorMode = $injector.get('geColorMode');
      geColorMode.set(geColorMode.get());
    }
  }
})();
