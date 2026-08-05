(function () {
  'use strict';

  function getCreateFocusTrap($window) {
    if ($window && $window.focusTrap && typeof $window.focusTrap.createFocusTrap === 'function') {
      return $window.focusTrap.createFocusTrap;
    }
    return null;
  }

  function geFocusTrapLink(scope, element, $window) {
    var createFocusTrap = getCreateFocusTrap($window);
    if (!createFocusTrap) {
      return;
    }

    var trapEl = element[0];
    var trap = createFocusTrap(trapEl, {
      delayInitialFocus: false,
      fallbackFocus: trapEl,
    });
    var isActivated = false;
    var destroyed = false;

    if (!trapEl.hasAttribute('tabindex')) {
      trapEl.setAttribute('tabindex', '-1');
    }

    function syncActive(isActive) {
      if (destroyed || !trap) {
        return;
      }

      var shouldActivate = isActive !== false;

      if (shouldActivate && !isActivated) {
        trap.activate();
        isActivated = true;
      } else if (!shouldActivate && isActivated) {
        trap.deactivate();
        isActivated = false;
      }
    }

    scope.$watch('active', function onActiveChange(isActive) {
      syncActive(isActive);
    });

    scope.$on('$destroy', function onDestroy() {
      destroyed = true;
      if (trap && isActivated) {
        trap.deactivate({ returnFocus: false });
        isActivated = false;
      }
      trap = null;
    });
  }

  function geFocusTrapDirective($window) {
    function link(scope, element) {
      geFocusTrapLink(scope, element, $window);
    }

    return {
      restrict: 'A',
      scope: {
        active: '=?',
      },
      link: link,
    };
  }

  if (typeof angular !== 'undefined') {
    try {
      angular.module('gravityElements.core').directive('geFocusTrap', geFocusTrapDirective);
    } catch (e) {
      // Módulo ainda não declarado — registro ocorre quando core.module.js existir.
    }
  }
})();
