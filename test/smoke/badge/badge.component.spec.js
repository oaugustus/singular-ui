'use strict';

describe('geBadge smoke', function () {
  var $compile;
  var $rootScope;
  var host;
  var appRoot;
  var geTv;
  var geBadgeTheme;

  beforeEach(function () {
    appRoot = document.createElement('div');
    document.body.appendChild(appRoot);
    angular.bootstrap(appRoot, ['gravityElements.smoke']);

    var injector = angular.element(appRoot).injector();
    $compile = injector.get('$compile');
    $rootScope = injector.get('$rootScope');
    geTv = injector.get('geTv');
    geBadgeTheme = injector.get('geBadgeTheme');

    host = document.createElement('div');
    appRoot.appendChild(host);
  });

  afterEach(function () {
    if (appRoot && appRoot.parentNode) {
      appRoot.parentNode.removeChild(appRoot);
    }
  });

  function compileBadge(html) {
    var scope = $rootScope.$new();
    var element = $compile(html)(scope);
    host.appendChild(element[0]);
    scope.$digest();
    return element;
  }

  it('monta end-to-end com defaultVariants via geTv', function () {
    var element = compileBadge('<ge-badge label="Hello"></ge-badge>');
    var span = element.find('span')[0];
    var expected = geTv(geBadgeTheme)({}).base;

    expect(span).toBeDefined();
    expect(span.textContent).toBe('Hello');
    expect(span.className).toBe(expected);
    expect(span.className).toContain('inline-flex');
    expect(span.className).toContain('rounded');
    expect(span.className).toContain('bg-primary');
    expect(span.className).toContain('text-white');
  });

  it('aplica override de color via geTv', function () {
    var element = compileBadge(
      '<ge-badge label="Neutral" color="neutral"></ge-badge>'
    );
    var span = element.find('span')[0];
    var expected = geTv(geBadgeTheme)({ color: 'neutral' }).base;

    expect(span.textContent).toBe('Neutral');
    expect(span.className).toBe(expected);
    expect(span.className).toContain('bg-neutral');
    expect(span.className).toContain('text-black');
    expect(span.className).not.toContain('bg-primary');
  });
});
