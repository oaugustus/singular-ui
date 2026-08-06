(function () {
  'use strict';

  function geIdFactory() {
    var counter = 0;

    function next(prefix) {
      counter += 1;
      return prefix + '-' + counter;
    }

    return {
      next: next,
    };
  }

  if (typeof angular !== 'undefined') {
    try {
      angular.module('gravityElements.core').factory('geId', geIdFactory);
    } catch (e) {
      // Módulo ainda não declarado — registro ocorre quando core.module.js existir.
    }
  }
})();
