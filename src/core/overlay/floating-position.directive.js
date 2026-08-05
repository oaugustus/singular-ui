(function () {
  'use strict';

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
