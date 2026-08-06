(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('angular')) :
  typeof define === 'function' && define.amd ? define(['angular'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.gravityElements = factory(global.angular));
})(this, (function (angular$1) { 'use strict';

  (function () {

    angular.module('gravityElements.core', ['ngAria', 'ngAnimate']);
  })();

  (function () {

    function getTwMerge() {
      if (typeof window !== 'undefined' && typeof window.twMerge === 'function') {
        return window.twMerge;
      }
      return function identityMerge(className) {
        return className;
      };
    }

    function resolveVariantValue(value, slotName) {
      if (value === undefined || value === null || value === '') {
        return '';
      }
      if (typeof value === 'string') {
        return slotName === 'base' ? value : '';
      }
      if (typeof value === 'object') {
        return value[slotName] || '';
      }
      return '';
    }

    function applyCompoundClass(classValue, slotName) {
      if (classValue === undefined || classValue === null || classValue === '') {
        return '';
      }
      if (typeof classValue === 'string') {
        return slotName === 'base' ? classValue : '';
      }
      if (typeof classValue === 'object') {
        return classValue[slotName] || '';
      }
      return '';
    }

    function compoundMatches(entry, resolved) {
      var key;
      for (key in entry) {
        if (!Object.prototype.hasOwnProperty.call(entry, key)) {
          continue;
        }
        if (key === 'class' || key === 'className') {
          continue;
        }
        if (resolved[key] !== entry[key]) {
          return false;
        }
      }
      return true;
    }

    function geTv(theme) {
      return function resolve(props) {
        var slots = (theme && theme.slots) || {};
        var variants = (theme && theme.variants) || {};
        var compoundVariants = (theme && theme.compoundVariants) || [];
        var defaultVariants = (theme && theme.defaultVariants) || {};
        var inputProps = props || {};
        var resolved = {};
        var result = {};
        var slotName;
        var variantName;
        var variantMap;
        var activeValue;
        var variantClasses;
        var parts;
        var i;
        var entry;
        var compoundClass;
        var twMerge = getTwMerge();
        var key;

        for (key in defaultVariants) {
          if (Object.prototype.hasOwnProperty.call(defaultVariants, key)) {
            resolved[key] = defaultVariants[key];
          }
        }

        for (key in inputProps) {
          if (
            Object.prototype.hasOwnProperty.call(inputProps, key) &&
            inputProps[key] !== undefined
          ) {
            resolved[key] = inputProps[key];
          }
        }

        for (slotName in slots) {
          if (!Object.prototype.hasOwnProperty.call(slots, slotName)) {
            continue;
          }

          parts = [];
          if (slots[slotName]) {
            parts.push(slots[slotName]);
          }

          for (variantName in variants) {
            if (!Object.prototype.hasOwnProperty.call(variants, variantName)) {
              continue;
            }
            variantMap = variants[variantName];
            activeValue = resolved[variantName];
            if (activeValue === undefined || activeValue === null) {
              continue;
            }
            variantClasses = resolveVariantValue(variantMap[activeValue], slotName);
            if (variantClasses) {
              parts.push(variantClasses);
            }
          }

          for (i = 0; i < compoundVariants.length; i += 1) {
            entry = compoundVariants[i];
            if (!compoundMatches(entry, resolved)) {
              continue;
            }
            compoundClass = applyCompoundClass(
              entry.class !== undefined ? entry.class : entry.className,
              slotName
            );
            if (compoundClass) {
              parts.push(compoundClass);
            }
          }

          result[slotName] = twMerge(parts.join(' '));
        }

        return result;
      };
    }

    if (typeof window !== 'undefined') {
      window.geTv = geTv;
    }

    if (typeof angular !== 'undefined') {
      try {
        angular.module('gravityElements.core').factory('geTv', geTvFactory);
      } catch (e) {
        // Módulo ainda não declarado — registro ocorre quando core.module.js existir.
      }
    }

    function geTvFactory() {
      return geTv;
    }
  })();

  (function () {

    var BASE_Z_INDEX = 1000;

    function geOverlayStackFactory() {
      var stack = [];

      function push(overlayRef) {
        stack.push(overlayRef);
        return BASE_Z_INDEX + (stack.length - 1);
      }

      function pop(overlayRef) {
        var index = stack.indexOf(overlayRef);
        if (index === -1) {
          return;
        }
        stack.splice(index, 1);
      }

      function top() {
        if (stack.length === 0) {
          return null;
        }
        return stack[stack.length - 1];
      }

      function size() {
        return stack.length;
      }

      return {
        push: push,
        pop: pop,
        top: top,
        size: size,
      };
    }

    if (typeof angular !== 'undefined') {
      try {
        angular.module('gravityElements.core').factory('geOverlayStack', geOverlayStackFactory);
      } catch (e) {
        // Módulo ainda não declarado — registro ocorre quando core.module.js existir.
      }
    }
  })();

  (function () {

    function getFloatingUiDom($window) {
      if ($window && $window.FloatingUIDOM) {
        return $window.FloatingUIDOM;
      }
      return null;
    }

    function resolveReferenceElement(reference, $document) {
      if (!reference) {
        return null;
      }
      if (reference.nodeType === 1) {
        return reference;
      }
      if (reference.length && reference[0] && reference[0].nodeType === 1) {
        return reference[0];
      }
      if (typeof reference === 'string') {
        return $document[0].querySelector(reference);
      }
      return null;
    }

    function geFloatingPositionLink(scope, element, $window, $document) {
      var floatingUi = getFloatingUiDom($window);
      if (!floatingUi || typeof floatingUi.computePosition !== 'function') {
        return;
      }

      var floatingEl = element[0];
      var cleanup = null;
      var destroyed = false;

      function applyPosition() {
        var referenceEl = resolveReferenceElement(scope.reference, $document);
        if (!referenceEl || destroyed) {
          return;
        }

        var placement = scope.placement || 'bottom';
        var offsetValue = scope.offset != null ? scope.offset : 0;
        var middleware = [];

        if (typeof floatingUi.offset === 'function') {
          middleware.push(floatingUi.offset(offsetValue));
        }

        floatingUi
          .computePosition(referenceEl, floatingEl, {
            placement: placement,
            middleware: middleware,
          })
          .then(function applyCoords(coords) {
            if (destroyed) {
              return;
            }
            floatingEl.style.position = 'absolute';
            floatingEl.style.left = coords.x + 'px';
            floatingEl.style.top = coords.y + 'px';
            scope.$applyAsync();
          });
      }

      function startAutoUpdate() {
        var referenceEl = resolveReferenceElement(scope.reference, $document);
        if (!referenceEl) {
          return;
        }

        if (typeof cleanup === 'function') {
          cleanup();
          cleanup = null;
        }

        if (typeof floatingUi.autoUpdate === 'function') {
          cleanup = floatingUi.autoUpdate(referenceEl, floatingEl, applyPosition);
        } else {
          applyPosition();
        }
      }

      startAutoUpdate();

      scope.$watch('reference', function onReferenceChange() {
        startAutoUpdate();
      });

      scope.$watch('placement', function onPlacementChange() {
        applyPosition();
      });

      scope.$watch('offset', function onOffsetChange() {
        applyPosition();
      });

      scope.$on('$destroy', function onDestroy() {
        destroyed = true;
        if (typeof cleanup === 'function') {
          cleanup();
          cleanup = null;
        }
      });
    }

    function geFloatingPositionDirective($window, $document) {
      function link(scope, element) {
        geFloatingPositionLink(scope, element, $window, $document);
      }

      return {
        restrict: 'A',
        scope: {
          reference: '=',
          placement: '@?',
          offset: '=?',
        },
        link: link,
      };
    }

    if (typeof angular !== 'undefined') {
      try {
        angular
          .module('gravityElements.core')
          .directive('geFloatingPosition', geFloatingPositionDirective);
      } catch (e) {
        // Módulo ainda não declarado — registro ocorre quando core.module.js existir.
      }
    }
  })();

  (function () {

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

  (function () {

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

  (function () {

    angular.module('gravityElements', ['gravityElements.core']);
  })();

  var index = angular$1.module('gravityElements');

  return index;

}));
//# sourceMappingURL=gravity-elements.umd.js.map
