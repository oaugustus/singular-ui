(function () {
  'use strict';

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
