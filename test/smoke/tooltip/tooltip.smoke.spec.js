'use strict';

describe('tooltip smoke (floating + focus-trap + hotkey)', function () {
  var $compile;
  var $rootScope;
  var host;
  var appRoot;
  var anchor;

  function waitForPosition(el, onReady, onFail) {
    var attempts = 0;

    function check() {
      attempts += 1;
      if (el.style.position === 'absolute' && el.style.top && el.style.left) {
        onReady();
        return;
      }
      if (attempts > 40) {
        onFail(
          'posição não aplicada: position=' +
            el.style.position +
            ' top=' +
            el.style.top +
            ' left=' +
            el.style.left
        );
        return;
      }
      setTimeout(check, 25);
    }

    check();
  }

  function fireEsc(element) {
    var event = new KeyboardEvent('keydown', {
      key: 'Escape',
      code: 'Escape',
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(event, 'keyCode', {
      get: function getKeyCode() {
        return 27;
      },
    });
    Object.defineProperty(event, 'which', {
      get: function getWhich() {
        return 27;
      },
    });

    element.dispatchEvent(event);
  }

  beforeEach(function () {
    appRoot = document.createElement('div');
    document.body.appendChild(appRoot);
    angular.bootstrap(appRoot, ['gravityElements.core']);

    var injector = angular.element(appRoot).injector();
    $compile = injector.get('$compile');
    $rootScope = injector.get('$rootScope');

    host = document.createElement('div');
    appRoot.appendChild(host);

    anchor = document.createElement('button');
    anchor.type = 'button';
    anchor.id = 'smoke-tt-anchor';
    anchor.textContent = 'Anchor';
    anchor.style.position = 'absolute';
    anchor.style.top = '40px';
    anchor.style.left = '60px';
    anchor.style.width = '80px';
    anchor.style.height = '24px';
    host.appendChild(anchor);
  });

  afterEach(function () {
    if (appRoot && appRoot.parentNode) {
      appRoot.parentNode.removeChild(appRoot);
    }
  });

  function compileTooltip(scope) {
    // Wrapper sem isolate: floating+trap aninhados; hotkey irmão (on-trigger no scope do teste).
    // No demo, hotkey envolve o tip para o ESC real borbulhar até o Mousetrap local.
    var html =
      '<div class="smoke-tt-root">' +
      '<div id="smoke-tt-tip" ge-floating-position reference="anchor" placement="bottom" offset="8">' +
      '<div ge-focus-trap active="$parent.open">' +
      '<button type="button" id="smoke-tt-inside">Dentro</button>' +
      '</div>' +
      '</div>' +
      '<div id="smoke-tt-hotkey" ge-hotkey key="esc" on-trigger="close()" tabindex="-1"></div>' +
      '</div>';

    var root = angular.element(html);
    host.appendChild(root[0]);
    $compile(root)(scope);
    scope.$digest();
    return {
      tip: root[0].querySelector('#smoke-tt-tip'),
      hotkey: root[0].querySelector('#smoke-tt-hotkey'),
      inside: root[0].querySelector('#smoke-tt-inside'),
    };
  }

  it('aplica posição flutuante relativa ao botão âncora', function (done) {
    var scope = $rootScope.$new();
    scope.anchor = anchor;
    scope.open = true;
    scope.close = function noopClose() {};

    var els = compileTooltip(scope);

    waitForPosition(
      els.tip,
      function onReady() {
        expect(els.tip.style.position).toBe('absolute');
        expect(parseFloat(els.tip.style.top)).not.toBeNaN();
        expect(parseFloat(els.tip.style.left)).not.toBeNaN();
        expect(parseFloat(els.tip.style.top)).toBeGreaterThan(0);
        done();
      },
      done.fail
    );
  });

  it('ge-hotkey ESC dispara close com tip aberto', function (done) {
    var closed = 0;
    var scope = $rootScope.$new();
    scope.anchor = anchor;
    scope.open = true;
    scope.close = function onClose() {
      closed += 1;
      scope.open = false;
    };

    var els = compileTooltip(scope);

    waitForPosition(
      els.tip,
      function onReady() {
        fireEsc(els.hotkey);
        expect(closed).toBe(1);
        expect(scope.open).toBe(false);
        done();
      },
      done.fail
    );
  });

  it('ge-focus-trap prende o foco dentro do tip enquanto ativo', function (done) {
    var outside = document.createElement('button');
    outside.type = 'button';
    outside.id = 'smoke-tt-outside';
    outside.textContent = 'Outside';
    host.appendChild(outside);
    outside.focus();

    var scope = $rootScope.$new();
    scope.anchor = anchor;
    scope.open = true;
    scope.close = function noopClose() {};

    var els = compileTooltip(scope);

    waitForPosition(
      els.tip,
      function onReady() {
        expect(els.tip.contains(document.activeElement)).toBe(true);
        expect(document.activeElement).toBe(els.inside);
        done();
      },
      done.fail
    );
  });
});
