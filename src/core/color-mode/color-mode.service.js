(function () {
  'use strict';

  var STORAGE_KEY = 'ge-color-mode';
  var DARK_CLASS = 'dark';
  var MODE_LIGHT = 'light';
  var MODE_DARK = 'dark';
  var MODE_SYSTEM = 'system';

  function geColorModeFactory($window) {
    function readStored() {
      var stored = $window.localStorage.getItem(STORAGE_KEY);
      if (stored === MODE_LIGHT || stored === MODE_DARK || stored === MODE_SYSTEM) {
        return stored;
      }
      return MODE_SYSTEM;
    }

    function prefersDark() {
      return Boolean(
        $window.matchMedia &&
          $window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    }

    function resolveEffective(mode) {
      if (mode === MODE_SYSTEM) {
        return prefersDark() ? MODE_DARK : MODE_LIGHT;
      }
      return mode;
    }

    function applyClass(effective) {
      var root = $window.document.documentElement;
      if (effective === MODE_DARK) {
        root.classList.add(DARK_CLASS);
      } else {
        root.classList.remove(DARK_CLASS);
      }
    }

    function get() {
      return readStored();
    }

    function set(mode) {
      var next = mode;
      if (next !== MODE_LIGHT && next !== MODE_DARK && next !== MODE_SYSTEM) {
        next = MODE_SYSTEM;
      }
      $window.localStorage.setItem(STORAGE_KEY, next);
      applyClass(resolveEffective(next));
    }

    function toggle() {
      var effective = resolveEffective(readStored());
      var next = effective === MODE_DARK ? MODE_LIGHT : MODE_DARK;
      set(next);
    }

    return {
      get: get,
      set: set,
      toggle: toggle,
    };
  }

  if (typeof angular !== 'undefined') {
    try {
      angular.module('gravityElements.core').factory('geColorMode', geColorModeFactory);
    } catch (e) {
      // Módulo ainda não declarado — registro ocorre quando core.module.js existir.
    }
  }
})();
