'use strict';

describe('geHeader', function () {
  var $compile;
  var $rootScope;
  var host;
  var appRoot;
  var geTv;
  var geHeaderTheme;

  beforeEach(function () {
    appRoot = document.createElement('div');
    document.body.appendChild(appRoot);
    angular.bootstrap(appRoot, ['gravityElements']);

    var injector = angular.element(appRoot).injector();
    $compile = injector.get('$compile');
    $rootScope = injector.get('$rootScope');
    geTv = injector.get('geTv');
    geHeaderTheme = injector.get('geHeaderTheme');

    host = document.createElement('div');
    appRoot.appendChild(host);
  });

  afterEach(function () {
    if (appRoot && appRoot.parentNode) {
      appRoot.parentNode.removeChild(appRoot);
    }
  });

  function compileHeader(html) {
    var scope = $rootScope.$new();
    var element = $compile(html)(scope);
    host.appendChild(element[0]);
    scope.$digest();
    return element;
  }

  /**
   * Conteúdo de slots nomeados fica dentro de <ge-header-*>; o default
   * (center) é filho direto do wrapper com classes do tema.
   */
  function themedSlotParent(node) {
    var parent = node.parentNode;
    if (parent && /^GE-HEADER-/i.test(parent.tagName)) {
      return parent.parentNode;
    }
    return parent;
  }

  it('aplica tema default, title no link e transclui o slot default em center', function () {
    var element = compileHeader(
      '<ge-header title="Gravity">' +
        '<span class="child">Nav</span>' +
        '</ge-header>'
    );
    var root = element.children()[0];
    var expected = geTv(geHeaderTheme)({});
    var titleLink = root.querySelector('a');
    var center = root.querySelector('[class*="hidden"]');
    var child = element[0].querySelector('.child');

    expect(root.tagName.toLowerCase()).toBe('header');
    expect(root.className).toBe(expected.root);
    expect(titleLink).not.toBeNull();
    expect(titleLink.getAttribute('href')).toBe('/');
    expect(titleLink.getAttribute('aria-label')).toBe('Gravity');
    expect(titleLink.className).toBe(expected.title);
    expect(titleLink.textContent.trim()).toBe('Gravity');
    expect(child).not.toBeNull();
    expect(child.textContent).toBe('Nav');
    expect(center).not.toBeNull();
    expect(center.className).toBe(expected.center);
    expect(center.contains(child)).toBe(true);
  });

  it('distribui conteúdo multi-slot nas regiões left/right/top/bottom', function () {
    var element = compileHeader(
      '<ge-header title="App" to="/home">' +
        '<ge-header-top><span class="slot-top">Top</span></ge-header-top>' +
        '<ge-header-left><span class="slot-left">Left</span></ge-header-left>' +
        '<span class="slot-center">Center</span>' +
        '<ge-header-right><span class="slot-right">Right</span></ge-header-right>' +
        '<ge-header-bottom><span class="slot-bottom">Bottom</span></ge-header-bottom>' +
        '</ge-header>'
    );
    var root = element.children()[0];
    var expected = geTv(geHeaderTheme)({});
    var leftRegion = root.querySelector('[class*="lg:flex-1"]');
    var topEl = themedSlotParent(root.querySelector('.slot-top'));
    var bottomEl = themedSlotParent(root.querySelector('.slot-bottom'));
    var leftEl = themedSlotParent(root.querySelector('.slot-left'));
    var rightEl = themedSlotParent(root.querySelector('.slot-right'));
    var centerEl = themedSlotParent(root.querySelector('.slot-center'));

    // Com left preenchido, o link default do título não é renderizado.
    expect(root.querySelector('a')).toBeNull();
    expect(leftRegion).not.toBeNull();
    expect(leftRegion.className).toBe(expected.left);
    expect(leftEl).not.toBeNull();
    expect(leftRegion.contains(root.querySelector('.slot-left'))).toBe(true);
    expect(rightEl.className).toBe(expected.right);
    expect(centerEl.className).toBe(expected.center);
    expect(root.querySelector('.slot-top').textContent).toBe('Top');
    expect(root.querySelector('.slot-left').textContent).toBe('Left');
    expect(root.querySelector('.slot-center').textContent).toBe('Center');
    expect(root.querySelector('.slot-right').textContent).toBe('Right');
    expect(root.querySelector('.slot-bottom').textContent).toBe('Bottom');
    // top/bottom não têm classes de tema próprias nesta etapa (só condicionais).
    expect(topEl).not.toBeNull();
    expect(bottomEl).not.toBeNull();
  });
});
