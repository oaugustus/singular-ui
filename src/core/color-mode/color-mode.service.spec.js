'use strict';

describe('geColorMode', function () {
  var geColorMode;
  var root;
  var originalMatchMedia;

  beforeEach(function () {
    root = document.documentElement;
    localStorage.removeItem('ge-color-mode');
    root.classList.remove('dark');
    originalMatchMedia = window.matchMedia;
    geColorMode = angular.injector(['ng', 'gravityElements.core']).get('geColorMode');
  });

  afterEach(function () {
    localStorage.removeItem('ge-color-mode');
    root.classList.remove('dark');
    window.matchMedia = originalMatchMedia;
  });

  it('get() retorna system quando localStorage está vazio', function () {
    expect(geColorMode.get()).toBe('system');
  });

  it('set(dark) persiste e adiciona a classe dark no documentElement', function () {
    geColorMode.set('dark');
    expect(localStorage.getItem('ge-color-mode')).toBe('dark');
    expect(root.classList.contains('dark')).toBe(true);
    expect(geColorMode.get()).toBe('dark');
  });

  it('set(light) remove a classe dark do documentElement', function () {
    geColorMode.set('dark');
    geColorMode.set('light');
    expect(localStorage.getItem('ge-color-mode')).toBe('light');
    expect(root.classList.contains('dark')).toBe(false);
  });

  it('toggle() alterna light ↔ dark pelo modo efetivo', function () {
    geColorMode.set('light');
    geColorMode.toggle();
    expect(geColorMode.get()).toBe('dark');
    expect(root.classList.contains('dark')).toBe(true);

    geColorMode.toggle();
    expect(geColorMode.get()).toBe('light');
    expect(root.classList.contains('dark')).toBe(false);
  });

  it('toggle() com system resolve via matchMedia e grava o oposto', function () {
    window.matchMedia = function () {
      return { matches: true };
    };

    geColorMode.set('system');
    expect(root.classList.contains('dark')).toBe(true);

    geColorMode.toggle();
    expect(geColorMode.get()).toBe('light');
    expect(root.classList.contains('dark')).toBe(false);
  });
});
