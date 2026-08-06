(function () {
  'use strict';

  angular.module('demoApp').controller('SmokeTooltipController', SmokeTooltipController);

  SmokeTooltipController.$inject = ['$element', '$timeout'];

  function SmokeTooltipController($element, $timeout) {
    var vm = this;

    vm.open = false;
    vm.anchor = $element[0].querySelector('#smoke-tooltip-anchor');
    vm.escFired = false;
    vm.positionLabel = '—';
    vm.openTooltip = openTooltip;
    vm.close = close;

    function openTooltip() {
      vm.escFired = false;
      vm.open = true;
      $timeout(refreshPositionLabel, 50);
    }

    function close() {
      vm.escFired = true;
      vm.open = false;
      vm.positionLabel = '—';
    }

    function refreshPositionLabel() {
      var tip = $element[0].querySelector('#smoke-tooltip-tip');
      if (!tip || !vm.open) {
        return;
      }
      vm.positionLabel =
        'position=' +
        tip.style.position +
        '; top=' +
        tip.style.top +
        '; left=' +
        tip.style.left;
    }
  }
})();
