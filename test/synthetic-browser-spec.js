/* global describe, beforeEach, afterEach, it */
describe('check inside synthetic browser', function () {
  var bro = {
    setup: function () {
      if (typeof window === 'undefined') {
        /* jshint -W020 */
        window = {};
      }
    },
    teardown: function () {
      console.assert(typeof window === 'object', 'cannot find window');
    }
  };

  beforeEach(bro.setup);

  beforeEach(function loadCheckMoreTypes() {
    require('../check-more-types');
  });

  it('dummy test', function () {});

  it('has window', function () {
    console.assert(typeof window === 'object');
  });

  it('has window.check', function () {
    console.assert(typeof window.check === 'object');
  });

  it('has check.or', function () {
    console.assert(typeof window.check.or === 'function');
  });

  it('has verify', function () {
    console.assert(typeof window.check.verify === 'object');
  });

  it('has verify.unemptyString', function () {
    console.assert(typeof window.check.verify.unemptyString === 'function');
  });

  it('throws on empty string', function () {
    var threw;
    try {
      window.check.verify.unemptyString('', 'should throw');
    } catch (err) {
      threw = true;
    }
    console.assert(threw, 'did not throw an error');
  });

  afterEach(bro.teardown);
});
