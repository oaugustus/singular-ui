#!/usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var SRC_DIR = path.join(ROOT, 'src');
var OUT_FILE = path.join(ROOT, 'tailwind.safelist.json');
var THEME_SUFFIX = '.theme.js';

/**
 * Recursively collect absolute paths of *.theme.js under dir.
 * @param {string} dir
 * @returns {string[]}
 */
function findThemeFiles(dir) {
  var results = [];

  if (!fs.existsSync(dir)) {
    return results;
  }

  var entries = fs.readdirSync(dir, { withFileTypes: true });

  entries.forEach(function walkEntry(entry) {
    var fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results = results.concat(findThemeFiles(fullPath));
      return;
    }

    if (entry.isFile() && entry.name.endsWith(THEME_SUFFIX)) {
      results.push(fullPath);
    }
  });

  return results;
}

/**
 * Extract the object literal passed to .constant('Name', { ... }).
 * @param {string} source
 * @returns {string|null}
 */
function extractConstantObjectSource(source) {
  var match = source.match(/\.constant\s*\(\s*['"][^'"]+['"]\s*,\s*(\{)/);

  if (!match) {
    return null;
  }

  var start = match.index + match[0].length - 1;
  var depth = 0;
  var inSingle = false;
  var inDouble = false;
  var inTemplate = false;
  var escaped = false;
  var i;

  for (i = start; i < source.length; i += 1) {
    var ch = source[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if ((inSingle || inDouble || inTemplate) && ch === '\\') {
      escaped = true;
      continue;
    }

    if (inSingle) {
      if (ch === "'") {
        inSingle = false;
      }
      continue;
    }

    if (inDouble) {
      if (ch === '"') {
        inDouble = false;
      }
      continue;
    }

    if (inTemplate) {
      if (ch === '`') {
        inTemplate = false;
      }
      continue;
    }

    if (ch === "'") {
      inSingle = true;
      continue;
    }

    if (ch === '"') {
      inDouble = true;
      continue;
    }

    if (ch === '`') {
      inTemplate = true;
      continue;
    }

    if (ch === '{') {
      depth += 1;
      continue;
    }

    if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        return source.slice(start, i + 1);
      }
    }
  }

  return null;
}

/**
 * Parse theme object source into a plain JS object.
 * @param {string} objectSource
 * @returns {Object}
 */
function parseThemeObject(objectSource) {
  // Controlled eval: only the data object literal, never the Angular IIFE.
  // eslint-disable-next-line no-new-func
  var factory = new Function('return (' + objectSource + ');');
  return factory();
}

/**
 * Split a class string into tokens and add them to the set.
 * @param {Set<string>} classes
 * @param {*} value
 */
function addClassValue(classes, value) {
  if (typeof value === 'string') {
    value.split(/\s+/).forEach(function addToken(token) {
      if (token) {
        classes.add(token);
      }
    });
    return;
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    Object.keys(value).forEach(function walkSlot(key) {
      addClassValue(classes, value[key]);
    });
  }
}

/**
 * Collect Tailwind class tokens from a theme object structure.
 * @param {Object} theme
 * @param {Set<string>} classes
 */
function collectClassesFromTheme(theme, classes) {
  if (!theme || typeof theme !== 'object') {
    return;
  }

  if (theme.slots) {
    addClassValue(classes, theme.slots);
  }

  if (theme.variants && typeof theme.variants === 'object') {
    Object.keys(theme.variants).forEach(function walkDimension(dim) {
      var options = theme.variants[dim];

      if (!options || typeof options !== 'object') {
        return;
      }

      Object.keys(options).forEach(function walkOption(optionKey) {
        addClassValue(classes, options[optionKey]);
      });
    });
  }

  if (Array.isArray(theme.compoundVariants)) {
    theme.compoundVariants.forEach(function walkCompound(entry) {
      if (entry && entry.class !== undefined) {
        addClassValue(classes, entry.class);
      }
    });
  }
}

/**
 * Extract classes from a single *.theme.js file.
 * @param {string} filePath
 * @param {Set<string>} classes
 */
function extractFromThemeFile(filePath, classes) {
  var source = fs.readFileSync(filePath, 'utf8');
  var objectSource = extractConstantObjectSource(source);

  if (!objectSource) {
    console.warn('Aviso: nenhum .constant(..., { ... }) encontrado em ' + path.relative(ROOT, filePath));
    return;
  }

  var theme = parseThemeObject(objectSource);
  collectClassesFromTheme(theme, classes);
}

function main() {
  var themeFiles = findThemeFiles(SRC_DIR);
  var classes = new Set();

  themeFiles.forEach(function processFile(filePath) {
    extractFromThemeFile(filePath, classes);
  });

  var safelist = Array.from(classes).sort();
  var json = JSON.stringify(safelist, null, 2) + '\n';

  fs.writeFileSync(OUT_FILE, json, 'utf8');

  console.log(
    'Wrote ' + path.relative(ROOT, OUT_FILE) +
    ' (' + safelist.length + ' classes from ' + themeFiles.length + ' theme file(s))'
  );
}

main();
