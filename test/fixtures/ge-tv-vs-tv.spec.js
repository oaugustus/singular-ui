'use strict';

describe('fixture geTv vs tailwind-variants', function () {
  function materializeSlots(result) {
    var out = {};
    var key;

    for (key in result) {
      if (!Object.prototype.hasOwnProperty.call(result, key)) {
        continue;
      }
      out[key] = typeof result[key] === 'function' ? result[key]() : result[key];
    }

    return out;
  }

  geTvFixtureCases.forEach(function (fixtureCase) {
    it('bate com tv para: ' + fixtureCase.name, function () {
      var theme = geTvFixtureTheme;
      var suClasses = geTv(theme)(fixtureCase.props);
      var tvClasses = materializeSlots(tv(theme)(fixtureCase.props));
      var slotName;

      for (slotName in theme.slots) {
        if (!Object.prototype.hasOwnProperty.call(theme.slots, slotName)) {
          continue;
        }

        expect(normalizeClasses(suClasses[slotName])).toBe(
          normalizeClasses(tvClasses[slotName])
        );
      }
    });
  });
});
