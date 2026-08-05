(function () {
  'use strict';

  function getMousetrap($window) {
    if ($window && typeof $window.Mousetrap === 'function') {
      return $window.Mousetrap;
    }
    return null;
  }

  function geHotkeyLink(scope, element, $window) {
    var Mousetrap = getMousetrap($window);
    if (!Mousetrap) {
      return;
    }

    var trap = Mousetrap(element[0]);
    var boundKey = null;
    var destroyed = false;

    function onHotkey() {
      if (destroyed) {
        return;
      }

      if (scope.$root && !scope.$root.$$phase) {
        scope.$apply(function invokeTrigger() {
          scope.onTrigger();
        });
      } else {
        scope.onTrigger();
      }

      return false;
    }

    function syncKey(key) {
      if (destroyed || !trap) {
        return;
      }

      if (boundKey) {
        trap.unbind(boundKey);
        boundKey = null;
      }

      if (key) {
        trap.bind(key, onHotkey);
        boundKey = key;
      }
    }

    scope.$watch('key', function onKeyChange(key) {
      syncKey(key);
    });

    scope.$on('$destroy', function onDestroy() {
      destroyed = true;
      if (trap && boundKey) {
        trap.unbind(boundKey);
        boundKey = null;
      }
      trap = null;
    });
  }

  function geHotkeyDirective($window) {
    function link(scope, element) {
      geHotkeyLink(scope, element, $window);
    }

    return {
      restrict: 'A',
      scope: {
        key: '@',
        onTrigger: '&',
      },
      link: link,
    };
  }

  if (typeof angular !== 'undefined') {
    try {
      angular.module('gravityElements.core').directive('geHotkey', geHotkeyDirective);
    } catch (e) {
      // Módulo ainda não declarado — registro ocorre quando core.module.js existir.
    }
  }
})();
