var check = require('check-types');
console.assert(typeof check === 'object', 'has check object');
console.assert(typeof check.mixin === 'undefined', 'check-types does not have mixin');

var moreCheck = require('..');
console.assert(typeof moreCheck === 'object', 'has moreCheck object');
console.assert(typeof moreCheck.mixin === 'function', 'check-more-types has mixin');

console.assert(check.bit(1), 'check.bit works');
console.assert(!check.bit(true), 'check.bit negative works');

var _ = require('lodash');
var hasFoo = _.partialRight(moreCheck.has, 'foo');
console.assert(hasFoo({ foo: 'foo' }));
console.assert(!hasFoo({ bar: 'foo' }));
console.assert(!hasFoo({}));
