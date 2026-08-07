'use strict';

describe('geError', function () {
  var $compile;
  var $rootScope;
  var host;
  var appRoot;
  var geTv;
  var geErrorTheme;

  beforeEach(function () {
    appRoot = document.createElement('div');
    document.body.appendChild(appRoot);
    angular.bootstrap(appRoot, ['gravityElements']);

    var injector = angular.element(appRoot).injector();
    $compile = injector.get('$compile');
    $rootScope = injector.get('$rootScope');
    geTv = injector.get('geTv');
    geErrorTheme = injector.get('geErrorTheme');

    host = document.createElement('div');
    appRoot.appendChild(host);
  });

  afterEach(function () {
    if (appRoot && appRoot.parentNode) {
      appRoot.parentNode.removeChild(appRoot);
    }
  });

  function compileError(html, scopeExt) {
    var scope = $rootScope.$new();
    if (scopeExt) {
      Object.keys(scopeExt).forEach(function assign(key) {
        scope[key] = scopeExt[key];
      });
    }
    var element = $compile(html)(scope);
    host.appendChild(element[0]);
    scope.$digest();
    return { element: element, scope: scope };
  }

  it('aplica tema default no main e renderiza statusCode/statusMessage; clear visível', function () {
    var result = compileError(
      '<ge-error status-code="404" status-message="Page not found"></ge-error>'
    );
    var root = result.element.children()[0];
    var expected = geTv(geErrorTheme)({}).root;
    var button = result.element[0].querySelector('button');

    expect(root.tagName.toLowerCase()).toBe('main');
    expect(root.className).toBe(expected);
    expect(root.className).toContain(
      'min-h-[calc(100vh-var(--ui-header-height))]'
    );
    expect(root.textContent).toContain('404');
    expect(root.textContent).toContain('Page not found');
    expect(button).toBeDefined();
    expect(button).not.toBeNull();
    expect(button.textContent.trim()).toBe('Back to home');
  });

  it('aplica icon/message; clear=false esconde botão; onClear dispara no clique', function () {
    var cleared = false;
    var withClear = compileError(
      '<ge-error status-code="500" status-message="Error" message="Something went wrong" icon="i-lucide-bug" on-clear="onClear()"></ge-error>',
      {
        onClear: function onClear() {
          cleared = true;
        },
      }
    );

    var icon = withClear.element[0].querySelector('i');
    var button = withClear.element[0].querySelector('button');

    expect(icon).not.toBeNull();
    expect(icon.className).toContain('i-lucide-bug');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(withClear.element[0].textContent).toContain('Something went wrong');
    expect(button).not.toBeNull();

    angular.element(button).triggerHandler('click');
    withClear.scope.$digest();
    expect(cleared).toBe(true);

    var withoutClear = compileError(
      '<ge-error status-code="404" status-message="Gone" clear="false"></ge-error>'
    );
    expect(withoutClear.element[0].querySelector('button')).toBeNull();
  });
});
