(function () {
  'use strict';

  /**
   * geHeader — cabeçalho de layout (Layout).
   *
   * Paridade com Nuxt UI Header v4.10.0 (theme/header.ts + Header.vue) na
   * barra estática. Menu mobile (toggle / Modal·Slideover·Drawer) adiado
   * para Etapa 4 (Overlay) — Angular não reutiliza left/right duas vezes
   * como createReusableTemplate do Vue; slots omitidos do tema (§5.4.2).
   *
   * Transclusion escolhida (§6): multi-slot alinhado ao Header.vue —
   * title / left / default (center) / right / top / bottom.
   *
   * Uso:
   *   <ge-header title="App" to="/">
   *     <ge-header-title>...</ge-header-title>   <!-- opcional, dentro do link -->
   *     <ge-header-left>...</ge-header-left>     <!-- substitui o link do título -->
   *     nav center (default)
   *     <ge-header-right>...</ge-header-right>
   *     <ge-header-top>...</ge-header-top>
   *     <ge-header-bottom>...</ge-header-bottom>
   *   </ge-header>
   *
   * @param {string} [vm.title] - texto do título (também aria-label do link)
   * @param {string} [vm.to='/'] - href do link do título
   */
  angular.module('gravityElements.layout').component('geHeader', {
    template:
      '<header class="{{ vm.classes.root }}">' +
      '  <div ng-if="vm.hasTop" ng-transclude="top"></div>' +
      '  <ge-container>' +
      '    <div class="{{ vm.classes.container }}">' +
      '      <div class="{{ vm.classes.left }}">' +
      '        <div ng-if="vm.hasLeft" ng-transclude="left"></div>' +
      '        <a ng-if="!vm.hasLeft" href="{{ vm.href }}" class="{{ vm.classes.title }}" aria-label="{{ vm.ariaLabel }}">' +
      '          <span ng-if="vm.hasTitleSlot" ng-transclude="title"></span>' +
      '          <span ng-if="!vm.hasTitleSlot">{{ vm.title }}</span>' +
      '        </a>' +
      '      </div>' +
      '      <div class="{{ vm.classes.center }}" ng-transclude></div>' +
      '      <div class="{{ vm.classes.right }}" ng-transclude="right"></div>' +
      '    </div>' +
      '  </ge-container>' +
      '  <div ng-if="vm.hasBottom" ng-transclude="bottom"></div>' +
      '</header>',
    controllerAs: 'vm',
    transclude: {
      title: '?geHeaderTitle',
      left: '?geHeaderLeft',
      right: '?geHeaderRight',
      top: '?geHeaderTop',
      bottom: '?geHeaderBottom',
    },
    bindings: {
      title: '@',
      to: '@',
    },
    controller: HeaderController,
  });

  HeaderController.$inject = ['geTv', 'geHeaderTheme', '$transclude'];

  function HeaderController(geTv, geHeaderTheme, $transclude) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      vm.classes = geTv(geHeaderTheme)({});
      vm.hasTop = $transclude.isSlotFilled('top');
      vm.hasBottom = $transclude.isSlotFilled('bottom');
      vm.hasLeft = $transclude.isSlotFilled('left');
      vm.hasTitleSlot = $transclude.isSlotFilled('title');
      vm.href = vm.to || '/';
      // aria-label: prop title (docs Nuxt: manter title mesmo com slot title);
      // fallback vazio se omitido — sem hardcode "Nuxt UI".
      vm.ariaLabel = (vm.title || '').trim();
    }
  }
})();
