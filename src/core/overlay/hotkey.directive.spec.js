'use strict';

describe('suHotkey', function () {
  var $compile;
  var $rootScope;
  var host;
  var appRoot;

  beforeEach(function () {
    appRoot = document.createElement('div');
    document.body.appendChild(appRoot);
    angular.bootstrap(appRoot, ['singularUi.core']);

    var injector = angular.element(appRoot).injector();
    $compile = injector.get('$compile');
    $rootScope = injector.get('$rootScope');

    host = document.createElement('div');
    appRoot.appendChild(host);
  });

  afterEach(function () {
    if (appRoot && appRoot.parentNode) {
      appRoot.parentNode.removeChild(appRoot);
    }
  });

  function compileHotkey(scopeAttrs, key, onTriggerExpr) {
    var scope = $rootScope.$new();
    Object.keys(scopeAttrs || {}).forEach(function assignAttr(attrKey) {
      scope[attrKey] = scopeAttrs[attrKey];
    });

    var html =
      '<div su-hotkey tabindex="-1" key="' +
      key +
      '" on-trigger="' +
      onTriggerExpr +
      '">' +
      '<button type="button">Inside</button>' +
      '</div>';

    var el = angular.element(html);
    host.appendChild(el[0]);
    $compile(el)(scope);
    scope.$digest();

    return { scope: scope, element: el[0] };
  }

  function fireEsc(element) {
    var event = new KeyboardEvent('keydown', {
      key: 'Escape',
      code: 'Escape',
      bubbles: true,
      cancelable: true,
    });

    // Chrome Headless ignora keyCode/which no construtor; Mousetrap depende de e.which.
    Object.defineProperty(event, 'keyCode', {
      get: function getKeyCode() {
        return 27;
      },
    });
    Object.defineProperty(event, 'which', {
      get: function getWhich() {
        return 27;
      },
    });

    element.dispatchEvent(event);
  }

  it('dispara onTrigger ao pressionar a tecla configurada (esc)', function () {
    var triggered = 0;
    var result = compileHotkey(
      {
        onEsc: function onEsc() {
          triggered += 1;
        },
      },
      'esc',
      'onEsc()'
    );

    fireEsc(result.element);

    expect(triggered).toBe(1);
  });

  it('permite múltiplas instâncias com a mesma key sem sobrescrever', function () {
    var countA = 0;
    var countB = 0;

    var first = compileHotkey(
      {
        onEsc: function onEscA() {
          countA += 1;
        },
      },
      'esc',
      'onEsc()'
    );

    var second = compileHotkey(
      {
        onEsc: function onEscB() {
          countB += 1;
        },
      },
      'esc',
      'onEsc()'
    );

    fireEsc(first.element);
    fireEsc(second.element);

    expect(countA).toBe(1);
    expect(countB).toBe(1);
  });

  it('cleanup no $destroy faz unbind sem throw e não dispara mais', function () {
    var triggered = 0;
    var result = compileHotkey(
      {
        onEsc: function onEsc() {
          triggered += 1;
        },
      },
      'esc',
      'onEsc()'
    );

    expect(function () {
      result.scope.$destroy();
    }).not.toThrow();

    fireEsc(result.element);

    expect(triggered).toBe(0);
  });
});
