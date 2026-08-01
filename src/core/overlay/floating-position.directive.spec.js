'use strict';

describe('suFloatingPosition', function () {
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

  beforeEach(function () {
    appRoot = document.createElement('div');
    document.body.appendChild(appRoot);
    angular.bootstrap(appRoot, ['singularUi.core']);

    var injector = angular.element(appRoot).injector();
    $compile = injector.get('$compile');
    $rootScope = injector.get('$rootScope');

    host = document.createElement('div');
    appRoot.appendChild(host);

    anchor = document.createElement('button');
    anchor.type = 'button';
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

  it('aplica position absolute e top/left relativos à referência', function (done) {
    var scope = $rootScope.$new();
    scope.anchor = anchor;

    var floating = angular.element(
      '<div su-floating-position reference="anchor" placement="bottom" offset="0">tip</div>'
    );
    host.appendChild(floating[0]);
    $compile(floating)(scope);
    scope.$digest();

    waitForPosition(
      floating[0],
      function onReady() {
        expect(floating[0].style.position).toBe('absolute');
        expect(parseFloat(floating[0].style.top)).not.toBeNaN();
        expect(parseFloat(floating[0].style.left)).not.toBeNaN();
        expect(parseFloat(floating[0].style.top)).toBeGreaterThan(0);
        done();
      },
      done.fail
    );
  });

  it('aceita seletor string como reference', function (done) {
    anchor.id = 'su-fp-anchor';
    var scope = $rootScope.$new();
    scope.anchor = '#su-fp-anchor';

    var floating = angular.element(
      '<div su-floating-position reference="anchor">tip</div>'
    );
    host.appendChild(floating[0]);
    $compile(floating)(scope);
    scope.$digest();

    waitForPosition(
      floating[0],
      function onReady() {
        expect(floating[0].style.position).toBe('absolute');
        expect(floating[0].style.top).toMatch(/px$/);
        expect(floating[0].style.left).toMatch(/px$/);
        done();
      },
      done.fail
    );
  });

  it('cleanup no $destroy não lança', function (done) {
    var scope = $rootScope.$new();
    scope.anchor = anchor;

    var floating = angular.element(
      '<div su-floating-position reference="anchor">tip</div>'
    );
    host.appendChild(floating[0]);
    $compile(floating)(scope);
    scope.$digest();

    waitForPosition(
      floating[0],
      function onReady() {
        expect(function () {
          scope.$destroy();
        }).not.toThrow();
        done();
      },
      done.fail
    );
  });
});
