'use strict';

describe('geFocusTrap', function () {
  var $compile;
  var $rootScope;
  var host;
  var appRoot;

  beforeEach(function () {
    appRoot = document.createElement('div');
    document.body.appendChild(appRoot);
    angular.bootstrap(appRoot, ['gravityElements.core']);

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

  function compileTrap(scopeAttrs, activeExpr) {
    var scope = $rootScope.$new();
    Object.keys(scopeAttrs || {}).forEach(function assignAttr(key) {
      scope[key] = scopeAttrs[key];
    });

    var html =
      '<div ge-focus-trap' +
      (activeExpr ? ' active="' + activeExpr + '"' : '') +
      '>' +
      '<button type="button" id="ge-ft-first">First</button>' +
      '<button type="button" id="ge-ft-second">Second</button>' +
      '</div>';

    var trapEl = angular.element(html);
    host.appendChild(trapEl[0]);
    $compile(trapEl)(scope);
    scope.$digest();

    return { scope: scope, element: trapEl[0] };
  }

  it('com active=true, o foco fica dentro do trap após activate', function () {
    var outside = document.createElement('button');
    outside.type = 'button';
    outside.id = 'ge-ft-outside';
    outside.textContent = 'Outside';
    host.appendChild(outside);
    outside.focus();

    var result = compileTrap({ trapActive: true }, 'trapActive');
    var first = result.element.querySelector('#ge-ft-first');

    expect(result.element.contains(document.activeElement)).toBe(true);
    expect(document.activeElement).toBe(first);
  });

  it('desativa sem erro quando active passa de true para false', function () {
    var result = compileTrap({ trapActive: true }, 'trapActive');

    expect(function () {
      result.scope.trapActive = false;
      result.scope.$digest();
    }).not.toThrow();
  });

  it('cleanup no $destroy com trap ativo não lança', function () {
    var result = compileTrap({ trapActive: true }, 'trapActive');

    expect(result.element.contains(document.activeElement)).toBe(true);

    expect(function () {
      result.scope.$destroy();
    }).not.toThrow();
  });
});
