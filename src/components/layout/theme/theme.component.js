(function () {
  'use strict';

  /**
   * geTheme — botão de troca claro/escuro (Layout).
   *
   * Spec §6: integra geColorMode; binding opcional `mode` controla o serviço
   * de fora. Referência comportamental: ColorModeButton Nuxt UI v4.10.0
   * (UButton neutral/ghost + ícones light/dark). Não porta Theme.vue headless
   * nem a família ColorMode* (fora da v1 — spec técnica §12).
   *
   * Sem theme.theme.js (exceção §5): na tag v4.10.0 não existe theme/theme.ts
   * (Theme.vue é só provide/inject) e ColorModeButton não tem tema próprio
   * (estende Button). Classes estáticas no botão (§5.4.1) até existir geButton.
   *
   * @param {string} [vm.mode] - 'light' | 'dark' | 'system' (one-way)
   */
  angular.module('gravityElements.layout').component('geTheme', {
    template:
      '<button type="button"' +
      '  class="rounded-md font-medium inline-flex items-center justify-center transition-colors size-8 text-sm text-[var(--ui-text-muted)] hover:bg-[var(--ui-border)] hover:text-[var(--ui-text-highlighted)]"' +
      '  aria-label="Alternar tema claro/escuro"' +
      '  ng-click="vm.toggle()">' +
      // Ícones CSS passthrough (§5.4) até existir geIcon — trocar por <ge-icon>
      '  <i class="i-lucide-sun size-5 dark:hidden" aria-hidden="true"></i>' +
      '  <i class="i-lucide-moon size-5 hidden dark:inline-block" aria-hidden="true"></i>' +
      '</button>',
    controllerAs: 'vm',
    bindings: {
      mode: '<',
    },
    controller: ThemeController,
  });

  ThemeController.$inject = ['geColorMode', '$document'];

  function ThemeController(geColorMode, $document) {
    var vm = this;
    vm.$onInit = onInit;
    vm.$onChanges = onChanges;
    vm.toggle = toggle;

    function onInit() {
      applyModeIfPresent();
      syncIsDark();
    }

    function onChanges(changes) {
      if (changes.mode && !changes.mode.isFirstChange()) {
        applyModeIfPresent();
        syncIsDark();
      }
    }

    function applyModeIfPresent() {
      if (vm.mode === undefined || vm.mode === null || vm.mode === '') {
        return;
      }
      geColorMode.set(vm.mode);
    }

    function syncIsDark() {
      vm.isDark = $document[0].documentElement.classList.contains('dark');
    }

    function toggle() {
      geColorMode.toggle();
      syncIsDark();
    }
  }
})();
