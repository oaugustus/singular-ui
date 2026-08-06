'use strict';

describe('geId', function () {
  var geId;

  beforeEach(function () {
    geId = angular.injector(['ng', 'gravityElements.core']).get('geId');
  });

  it('primeira chamada retorna prefix-1', function () {
    expect(geId.next('ge-modal')).toBe('ge-modal-1');
  });

  it('chamadas sucessivas incrementam o contador', function () {
    expect(geId.next('ge-field')).toBe('ge-field-1');
    expect(geId.next('ge-field')).toBe('ge-field-2');
    expect(geId.next('ge-field')).toBe('ge-field-3');
  });

  it('prefixos diferentes compartilham o mesmo contador (singleton)', function () {
    expect(geId.next('ge-label')).toBe('ge-label-1');
    expect(geId.next('ge-desc')).toBe('ge-desc-2');
    expect(geId.next('ge-label')).toBe('ge-label-3');
  });
});
