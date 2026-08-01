'use strict';

window.normalizeClasses = function normalizeClasses(classString) {
  return String(classString || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .sort()
    .join(' ');
};
