(function () {
  'use strict';

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
    var expected;
    var actual;
    for (key in entry) {
      if (!Object.prototype.hasOwnProperty.call(entry, key)) {
        continue;
      }
      if (key === 'class' || key === 'className') {
        continue;
      }
      expected = entry[key];
      actual = resolved[key];
      // Array = OR (tailwind-variants / Nuxt UI theme/*.ts), ex.
      // collapsible: ['offcanvas', 'icon']
      if (Array.isArray(expected)) {
        if (expected.indexOf(actual) === -1) {
          return false;
        }
      } else if (actual !== expected) {
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
