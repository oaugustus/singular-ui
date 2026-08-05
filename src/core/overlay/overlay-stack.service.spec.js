'use strict';

describe('geOverlayStack', function () {
  var stack;

  beforeEach(function () {
    stack = angular.injector(['ng', 'gravityElements.core']).get('geOverlayStack');
  });

  it('começa vazia', function () {
    expect(stack.size()).toBe(0);
    expect(stack.top()).toBeNull();
  });

  it('push retorna z-index incremental a partir de 1000', function () {
    var a = { id: 'a' };
    var b = { id: 'b' };

    expect(stack.push(a)).toBe(1000);
    expect(stack.push(b)).toBe(1001);
    expect(stack.size()).toBe(2);
    expect(stack.top()).toBe(b);
  });

  it('pop remove overlay do meio sem alterar o topo', function () {
    var a = { id: 'a' };
    var b = { id: 'b' };
    var c = { id: 'c' };

    stack.push(a);
    stack.push(b);
    stack.push(c);

    stack.pop(b);

    expect(stack.size()).toBe(2);
    expect(stack.top()).toBe(c);
  });

  it('pop de ref inexistente não altera a pilha', function () {
    var a = { id: 'a' };
    var missing = { id: 'missing' };

    stack.push(a);
    stack.pop(missing);

    expect(stack.size()).toBe(1);
    expect(stack.top()).toBe(a);
  });
});
