'use strict';

describe('geFooter', function () {
  var $compile;
  var $rootScope;
  var host;
  var appRoot;
  var geTv;
  var geFooterTheme;

  beforeEach(function () {
    appRoot = document.createElement('div');
    document.body.appendChild(appRoot);
    angular.bootstrap(appRoot, ['gravityElements']);

    var injector = angular.element(appRoot).injector();
    $compile = injector.get('$compile');
    $rootScope = injector.get('$rootScope');
    geTv = injector.get('geTv');
    geFooterTheme = injector.get('geFooterTheme');

    host = document.createElement('div');
    appRoot.appendChild(host);
  });

  afterEach(function () {
    if (appRoot && appRoot.parentNode) {
      appRoot.parentNode.removeChild(appRoot);
    }
  });

  function compileFooter(html) {
    var scope = $rootScope.$new();
    var element = $compile(html)(scope);
    host.appendChild(element[0]);
    scope.$digest();
    return element;
  }

  it('aplica tema default no footer e transclui o slot default em center', function () {
    var element = compileFooter(
      '<ge-footer><span class="child">Copyright</span></ge-footer>'
    );
    var root = element.children()[0];
    var expected = geTv(geFooterTheme)({});
    var center = root.querySelector('[class*="lg:order-2"]');
    var child = element[0].querySelector('.child');
    var top = root.querySelector('[class*="lg:py-12"]');

    expect(root.tagName.toLowerCase()).toBe('footer');
    expect(root.className).toBe(expected.root);
    expect(child).not.toBeNull();
    expect(child.textContent).toBe('Copyright');
    expect(center).not.toBeNull();
    expect(center.className).toBe(expected.center);
    expect(center.contains(child)).toBe(true);
    // Sem slot top/bottom: wrappers condicionais ausentes (só py-8 lg:py-12
    // dos slots top/bottom — container não usa lg:py-12).
    expect(top).toBeNull();
  });

  /**
   * Conteúdo de slots nomeados fica dentro de <ge-footer-*>; o default
   * (center) é filho direto do wrapper com classes do tema.
   */
  function themedSlotParent(node) {
    var parent = node.parentNode;
    if (parent && /^GE-FOOTER-/i.test(parent.tagName)) {
      return parent.parentNode;
    }
    return parent;
  }

  it('distribui conteúdo multi-slot nas regiões left/right/top/bottom', function () {
    var element = compileFooter(
      '<ge-footer>' +
        '<ge-footer-top><span class="slot-top">Top</span></ge-footer-top>' +
        '<ge-footer-left><span class="slot-left">Left</span></ge-footer-left>' +
        '<span class="slot-center">Center</span>' +
        '<ge-footer-right><span class="slot-right">Right</span></ge-footer-right>' +
        '<ge-footer-bottom><span class="slot-bottom">Bottom</span></ge-footer-bottom>' +
        '</ge-footer>'
    );
    var root = element.children()[0];
    var expected = geTv(geFooterTheme)({});
    var topEl = themedSlotParent(root.querySelector('.slot-top'));
    var bottomEl = themedSlotParent(root.querySelector('.slot-bottom'));
    var leftEl = themedSlotParent(root.querySelector('.slot-left'));
    var rightEl = themedSlotParent(root.querySelector('.slot-right'));
    var centerEl = themedSlotParent(root.querySelector('.slot-center'));

    expect(topEl.className).toBe(expected.top);
    expect(bottomEl.className).toBe(expected.bottom);
    expect(leftEl.className).toBe(expected.left);
    expect(rightEl.className).toBe(expected.right);
    expect(centerEl.className).toBe(expected.center);
    expect(root.querySelector('.slot-top').textContent).toBe('Top');
    expect(root.querySelector('.slot-left').textContent).toBe('Left');
    expect(root.querySelector('.slot-center').textContent).toBe('Center');
    expect(root.querySelector('.slot-right').textContent).toBe('Right');
    expect(root.querySelector('.slot-bottom').textContent).toBe('Bottom');
  });
});
