'use strict';

describe('geSidebar', function () {
  var $compile;
  var $rootScope;
  var host;
  var appRoot;
  var geTv;
  var geSidebarTheme;

  beforeEach(function () {
    appRoot = document.createElement('div');
    document.body.appendChild(appRoot);
    angular.bootstrap(appRoot, ['gravityElements']);

    var injector = angular.element(appRoot).injector();
    $compile = injector.get('$compile');
    $rootScope = injector.get('$rootScope');
    geTv = injector.get('geTv');
    geSidebarTheme = injector.get('geSidebarTheme');

    host = document.createElement('div');
    appRoot.appendChild(host);
  });

  afterEach(function () {
    if (appRoot && appRoot.parentNode) {
      appRoot.parentNode.removeChild(appRoot);
    }
  });

  function compileSidebar(html, scopeExt) {
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

  it('aplica defaultVariants (none/sidebar/left) e transclui o body', function () {
    var compiled = compileSidebar(
      '<ge-sidebar><span class="child">Nav</span></ge-sidebar>'
    );
    var root = compiled.element.children()[0];
    var child = compiled.element[0].querySelector('.child');
    var expected = geTv(geSidebarTheme)({
      side: 'left',
      collapsible: 'none',
      variant: 'sidebar',
      transition: true,
    });

    expect(child).toBeDefined();
    expect(child).not.toBeNull();
    expect(child.textContent).toBe('Nav');
    expect(root.tagName.toLowerCase()).toBe('aside');
    expect(root.className).toBe(expected.root);
    expect(root.className).toContain('w-[var(--sidebar-width)]');
    expect(root.className).toContain('border-e');
    expect(root.getAttribute('data-variant')).toBe('sidebar');
    expect(root.hasAttribute('data-state')).toBe(false);
    expect(compiled.element[0].querySelector('button[aria-label]')).toBeNull();
  });

  it('override side/collapsible/open: data-state, toggle ARIA e onToggle', function () {
    var toggledOpen;
    var compiled = compileSidebar(
      '<ge-sidebar side="right" collapsible="offcanvas" open="open"' +
        ' on-toggle="onToggle(open)" title="Menu">' +
        '<span class="child">Body</span>' +
        '</ge-sidebar>',
      {
        open: false,
        onToggle: function (open) {
          toggledOpen = open;
        },
      }
    );
    var root = compiled.element.children()[0];
    var expected = geTv(geSidebarTheme)({
      side: 'right',
      collapsible: 'offcanvas',
      variant: 'sidebar',
      transition: true,
    });
    var toggle = compiled.element[0].querySelector(
      'button[aria-label="Alternar barra lateral"]'
    );

    expect(root.className).toBe(expected.root);
    expect(root.className).toContain('group/sidebar');
    expect(root.getAttribute('data-state')).toBe('collapsed');
    expect(root.getAttribute('data-side')).toBe('right');
    expect(root.getAttribute('data-collapsible')).toBe('offcanvas');
    expect(expected.container).toContain('end-0');
    expect(expected.container).toContain(
      'data-[state=collapsed]:-end-[var(--sidebar-width)]'
    );

    expect(toggle).not.toBeNull();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');

    angular.element(toggle).triggerHandler('click');
    compiled.scope.$digest();

    expect(compiled.scope.open).toBe(true);
    expect(toggledOpen).toBe(true);
    expect(root.getAttribute('data-state')).toBe('expanded');
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    // ng-attr remove o attr quando dataCollapsible é undefined (valor vazio)
    expect(root.getAttribute('data-collapsible')).toBeFalsy();
  });
});
