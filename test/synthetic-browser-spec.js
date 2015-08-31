/* global describe, beforeEach, afterEach, it */
var benv = require('benv');
describe('check inside synthetic browser', function () {
  beforeEach(function setupEnvironment(done) {
    benv.setup(function () {
      done();
    });
  });

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

  afterEach(function destroySyntheticBrowser() {
    benv.teardown(false);
  });
});
