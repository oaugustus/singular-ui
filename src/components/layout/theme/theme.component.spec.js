'use strict';

describe('geTheme', function () {
  var $compile;
  var $rootScope;
  var host;
  var appRoot;
  var geColorMode;

  beforeEach(function () {
    localStorage.removeItem('ge-color-mode');
    document.documentElement.classList.remove('dark');

    appRoot = document.createElement('div');
    document.body.appendChild(appRoot);
    angular.bootstrap(appRoot, ['gravityElements']);

    var injector = angular.element(appRoot).injector();
    $compile = injector.get('$compile');
    $rootScope = injector.get('$rootScope');
    geColorMode = injector.get('geColorMode');

    host = document.createElement('div');
    appRoot.appendChild(host);
  });

  afterEach(function () {
    localStorage.removeItem('ge-color-mode');
    document.documentElement.classList.remove('dark');
    if (appRoot && appRoot.parentNode) {
      appRoot.parentNode.removeChild(appRoot);
    }
  });

  function compileTheme(html, scopeExt) {
    var scope = $rootScope.$new();
    if (scopeExt) {
      Object.keys(scopeExt).forEach(function (key) {
        scope[key] = scopeExt[key];
      });
    }
    var element = $compile(html)(scope);
    host.appendChild(element[0]);
    scope.$digest();
    return { element: element, scope: scope };
  }

  it('renderiza botão com aria-label e toggle altera a classe dark', function () {
    geColorMode.set('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    var compiled = compileTheme('<ge-theme></ge-theme>');
    var button = compiled.element.children()[0];

    expect(button.tagName.toLowerCase()).toBe('button');
    expect(button.getAttribute('aria-label')).toBe('Alternar tema claro/escuro');
    expect(button.getAttribute('type')).toBe('button');

    angular.element(button).triggerHandler('click');
    compiled.scope.$digest();

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(geColorMode.get()).toBe('dark');
  });

  it('binding mode aplica geColorMode.set no init e em $onChanges', function () {
    var compiled = compileTheme('<ge-theme mode="mode"></ge-theme>', {
      mode: 'dark',
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(geColorMode.get()).toBe('dark');
    expect(compiled.element.children()[0].getAttribute('aria-label')).toBe(
      'Alternar tema claro/escuro'
    );

    compiled.scope.mode = 'light';
    compiled.scope.$digest();

    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(geColorMode.get()).toBe('light');
  });
});
