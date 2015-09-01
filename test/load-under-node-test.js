var check = require('..');
console.assert(typeof check === 'object', 'has check object');
console.assert(typeof check.mixin === 'function', 'check-more-types has mixin');
console.assert(check.bit(1), 'check.bit works');
console.assert(!check.bit(true), 'check.bit negative works');

var _ = require('lodash');
var hasFoo = _.partialRight(check.has, 'foo');
console.assert(hasFoo({ foo: 'foo' }));
console.assert(!hasFoo({ bar: 'foo' }));
console.assert(!hasFoo({}));
