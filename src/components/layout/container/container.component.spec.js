'use strict';

describe('geContainer', function () {
  var $compile;
  var $rootScope;
  var host;
  var appRoot;
  var geTv;
  var geContainerTheme;

  beforeEach(function () {
    appRoot = document.createElement('div');
    document.body.appendChild(appRoot);
    angular.bootstrap(appRoot, ['gravityElements']);

    var injector = angular.element(appRoot).injector();
    $compile = injector.get('$compile');
    $rootScope = injector.get('$rootScope');
    geTv = injector.get('geTv');
    geContainerTheme = injector.get('geContainerTheme');

    host = document.createElement('div');
    appRoot.appendChild(host);
  });

  afterEach(function () {
    if (appRoot && appRoot.parentNode) {
      appRoot.parentNode.removeChild(appRoot);
    }
  });

  function compileContainer(html) {
    var scope = $rootScope.$new();
    var element = $compile(html)(scope);
    host.appendChild(element[0]);
    scope.$digest();
    return element;
  }

  it('aplica defaultVariants (base) e transclui o conteúdo', function () {
    var element = compileContainer(
      '<ge-container><span class="child">Hello</span></ge-container>'
    );
    var root = element.children()[0];
    var child = element[0].querySelector('.child');
    var expected = geTv(geContainerTheme)({}).base;

    expect(child).toBeDefined();
    expect(child).not.toBeNull();
    expect(child.textContent).toBe('Hello');
    expect(root.className).toBe(expected);
    expect(root.className).toContain('mx-auto');
    expect(root.className).toContain('max-w-[var(--ui-container)]');
    expect(root.className).toContain('w-full');
  });

  it('aplica override de size via geTv', function () {
    var element = compileContainer(
      '<ge-container size="lg"><span class="child">Wide</span></ge-container>'
    );
    var root = element.children()[0];
    var expected = geTv(geContainerTheme)({ size: 'lg' }).base;

    expect(root.className).toBe(expected);
    expect(root.className).toContain('max-w-screen-lg');
    expect(root.className).toContain('mx-auto');
  });
});
