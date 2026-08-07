(function () {
  'use strict';

  /**
   * geError — página de erro genérica (404/500) (Layout).
   *
   * Paridade com Nuxt UI Error v4.10.0 (theme/error.ts + Error.vue).
   * Bindings da §6 + `message` / `icon` (§5.4.2 — slots do tema upstream).
   *
   * icon: classe CSS inline até existir geIcon (§5.4) — trocar por <ge-icon>
   * quando a tarefa "Componente: Icon" for concluída.
   *
   * clear: <button> nativo aproximando UButton default (lg / primary / solid,
   * label "Back to home") até existir geButton (§5.4.1) — trocar por
   * <ge-button> quando a tarefa "Componente: Button" for concluída.
   *
   * @param {string} [vm.statusCode]
   * @param {string} [vm.statusMessage]
   * @param {string} [vm.message]
   * @param {string} [vm.icon] - nome/classe CSS do ícone (passthrough)
   * @param {boolean} [vm.clear=true] - mostra o botão de clear
   * @param {Function} [vm.onClear] - callback do botão clear
   */
  angular.module('gravityElements.layout').component('geError', {
    template:
      '<main class="{{ vm.classes.root }}">' +
      '  <div ng-if="vm.icon" class="{{ vm.classes.leading }}">' +
      '    <i class="{{ vm.icon }} {{ vm.classes.leadingIcon }}" aria-hidden="true"></i>' +
      '  </div>' +
      '  <p ng-if="vm.statusCode" class="{{ vm.classes.statusCode }}">{{ vm.statusCode }}</p>' +
      '  <h1 ng-if="vm.statusMessage" class="{{ vm.classes.statusMessage }}">{{ vm.statusMessage }}</h1>' +
      '  <p ng-if="vm.message" class="{{ vm.classes.message }}">{{ vm.message }}</p>' +
      '  <div ng-if="vm.showClear" class="{{ vm.classes.links }}">' +
      // Placeholder §5.4.1 — substituir por <ge-button> após Componente: Button
      '    <button type="button" class="rounded-md font-medium inline-flex items-center transition-colors px-3 py-2 text-sm gap-2 text-[var(--ui-text-inverted)] bg-[var(--ui-primary)] hover:bg-[var(--ui-primary)]/75" ng-click="vm.handleClear()">Back to home</button>' +
      '  </div>' +
      '</main>',
    controllerAs: 'vm',
    bindings: {
      statusCode: '@',
      statusMessage: '@',
      message: '@',
      icon: '@',
      clear: '<',
      onClear: '&',
    },
    controller: ErrorController,
  });

  ErrorController.$inject = ['geTv', 'geErrorTheme'];

  function ErrorController(geTv, geErrorTheme) {
    var vm = this;
    vm.$onInit = onInit;
    vm.$onChanges = onChanges;
    vm.handleClear = handleClear;

    function onInit() {
      // icon: classe CSS direta (§5.4) — trocar markup por <ge-icon name="...">
      // quando a tarefa Componente: Icon existir.
      vm.classes = geTv(geErrorTheme)({});
      syncClear();
    }

    function onChanges(changes) {
      if (changes.clear) {
        syncClear();
      }
    }

    function syncClear() {
      vm.showClear = vm.clear !== false;
    }

    function handleClear() {
      if (typeof vm.onClear === 'function') {
        vm.onClear();
      }
    }
  }
})();
