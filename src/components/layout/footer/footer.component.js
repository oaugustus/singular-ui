(function () {
  'use strict';

  /**
   * geFooter — rodapé de layout (Layout).
   *
   * Paridade com Nuxt UI Footer v4.10.0 (theme/footer.ts + Footer.vue).
   * Sem bindings próprios. Multi-slot (§5.3 / §5.4.2): top / left / default
   * (center) / right / bottom — tema completo 1:1; nenhum slot de tema sem uso.
   *
   * Uso:
   *   <ge-footer>
   *     <ge-footer-top>...</ge-footer-top>
   *     <ge-footer-left>...</ge-footer-left>
   *     conteúdo default → center
   *     <ge-footer-right>...</ge-footer-right>
   *     <ge-footer-bottom>...</ge-footer-bottom>
   *   </ge-footer>
   *
   * Ordem DOM de left/center/right espelha Footer.vue (right → center → left)
   * para o `lg:order-*` do tema reordenar corretamente em telas largas.
   */
  angular.module('gravityElements.layout').component('geFooter', {
    template:
      '<footer class="{{ vm.classes.root }}">' +
      '  <div ng-if="vm.hasTop" class="{{ vm.classes.top }}" ng-transclude="top"></div>' +
      '  <ge-container>' +
      '    <div class="{{ vm.classes.container }}">' +
      '      <div class="{{ vm.classes.right }}" ng-transclude="right"></div>' +
      '      <div class="{{ vm.classes.center }}" ng-transclude></div>' +
      '      <div class="{{ vm.classes.left }}" ng-transclude="left"></div>' +
      '    </div>' +
      '  </ge-container>' +
      '  <div ng-if="vm.hasBottom" class="{{ vm.classes.bottom }}" ng-transclude="bottom"></div>' +
      '</footer>',
    controllerAs: 'vm',
    transclude: {
      top: '?geFooterTop',
      left: '?geFooterLeft',
      right: '?geFooterRight',
      bottom: '?geFooterBottom',
    },
    controller: FooterController,
  });

  FooterController.$inject = ['geTv', 'geFooterTheme', '$transclude'];

  function FooterController(geTv, geFooterTheme, $transclude) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      vm.classes = geTv(geFooterTheme)({});
      // top/bottom condicionais como v-if="!!slots.*" no Footer.vue;
      // left/center/right sempre renderizam (wrappers vazios quando sem conteúdo).
      vm.hasTop = $transclude.isSlotFilled('top');
      vm.hasBottom = $transclude.isSlotFilled('bottom');
    }
  }
})();
