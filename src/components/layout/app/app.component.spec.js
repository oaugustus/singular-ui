'use strict';

describe('geApp', function () {
  var $compile;
  var $rootScope;
  var host;
  var appRoot;

  beforeEach(function () {
    localStorage.removeItem('ge-color-mode');
    document.documentElement.classList.remove('dark');

    appRoot = document.createElement('div');
    document.body.appendChild(appRoot);
    angular.bootstrap(appRoot, ['gravityElements']);

    var injector = angular.element(appRoot).injector();
    $compile = injector.get('$compile');
    $rootScope = injector.get('$rootScope');

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

  function compileApp(html) {
    var scope = $rootScope.$new();
    var element = $compile(html)(scope);
    host.appendChild(element[0]);
    scope.$digest();
    return element;
  }

  it('transclui o conteúdo filho', function () {
    var element = compileApp('<ge-app><span class="child">Hello</span></ge-app>');
    var child = element[0].querySelector('.child');

    expect(child).toBeDefined();
    expect(child).not.toBeNull();
    expect(child.textContent).toBe('Hello');
  });

  it('aplica o modo persistido de geColorMode no $onInit', function () {
    localStorage.setItem('ge-color-mode', 'dark');

    compileApp('<ge-app><span>content</span></ge-app>');

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
