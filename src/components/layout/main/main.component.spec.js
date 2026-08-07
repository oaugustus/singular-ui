'use strict';

describe('geMain', function () {
  var $compile;
  var $rootScope;
  var host;
  var appRoot;
  var geTv;
  var geMainTheme;

  beforeEach(function () {
    appRoot = document.createElement('div');
    document.body.appendChild(appRoot);
    angular.bootstrap(appRoot, ['gravityElements']);

    var injector = angular.element(appRoot).injector();
    $compile = injector.get('$compile');
    $rootScope = injector.get('$rootScope');
    geTv = injector.get('geTv');
    geMainTheme = injector.get('geMainTheme');

    host = document.createElement('div');
    appRoot.appendChild(host);
  });

  afterEach(function () {
    if (appRoot && appRoot.parentNode) {
      appRoot.parentNode.removeChild(appRoot);
    }
  });

  function compileMain(html) {
    var scope = $rootScope.$new();
    var element = $compile(html)(scope);
    host.appendChild(element[0]);
    scope.$digest();
    return element;
  }

  it('aplica tema default e transclui o conteúdo', function () {
    var element = compileMain(
      '<ge-main><span class="child">Hello</span></ge-main>'
    );
    var root = element.children()[0];
    var child = element[0].querySelector('.child');
    var expected = geTv(geMainTheme)({}).base;

    expect(child).toBeDefined();
    expect(child).not.toBeNull();
    expect(child.textContent).toBe('Hello');
    expect(root.className).toBe(expected);
    expect(root.className).toContain(
      'min-h-[calc(100vh-var(--ui-header-height))]'
    );
  });

  it('renderiza elemento semântico main com a classe de altura mínima', function () {
    var element = compileMain('<ge-main><span>Body</span></ge-main>');
    var root = element.children()[0];
    var expected = geTv(geMainTheme)({}).base;

    expect(root.tagName.toLowerCase()).toBe('main');
    expect(root.className).toBe(expected);
    expect(root.className).toContain(
      'min-h-[calc(100vh-var(--ui-header-height))]'
    );
  });
});
