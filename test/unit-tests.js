/* global describe, la, check, it, beforeEach */
describe('check-more-types', function () {
  var root = typeof window === 'object' ? window : global;

  it('has check', function () {
    la(global.check);
    la(typeof check === 'object');
    la(check.object(check));
  });

  it('has extra checks', function () {
    la(check.fn(check.bit));
    la(check.fn(check.lowerCase));
  });

  describe('check.primitive', function () {
    it('returns true for primitive javascript types', function () {
      la(check.primitive(42), 'number');
      la(check.primitive(true), 'boolean');
      la(check.primitive('foo'), 'string');
    });

    it('returns false for objects, arrays and functions', function () {
      la(!check.primitive([]), 'array');
      la(!check.primitive(describe), 'function');
      la(!check.primitive({}), 'object');
    });
  });

  describe('check.zero', function () {
    it('returns true if the argument is a number 0', function () {
      la(check.zero(0), '0');
      la(!check.zero(), 'not for undefined');
      la(!check.zero(null), 'not for null');
    });

    it('edge cases', function () {
      la(!check.not.zero(0));
    });
  });

  describe('check.or', function () {
    it('combines predicate functions', function () {
      var predicate = check.or(check.bool, check.unemptyString);
      la(check.fn(predicate), 'got new predicate function');
      la(predicate(true), 'boolean');
      la(predicate('foo'), 'unempty string');
      la(!predicate(42), 'not for a number');
    });

    it('allows single function', function () {
      var predicate = check.or(check.number);
      la(predicate(10));
      la(!predicate(true));
    });

    it('handles non-function values as truthy', function () {
      var predicate = check.or(check.unemptyString, 42);
      la(predicate(), '42 wins');
      la(predicate('foo'), 'string wins');
    });

    it('works with schema check', function () {
      var isFirstLastNames = check.schema.bind(null, {
        first: check.unemptyString,
        last: check.unemptyString
      });
      var isValidPerson = check.schema.bind(null, {
        name: check.or(check.unemptyString, isFirstLastNames)
      });
      la(isValidPerson({ name: 'foo' }));
      la(isValidPerson({ name: {
        first: 'foo',
        last: 'bar'
      }}));
      la(!isValidPerson({ first: 'foo' }));
    });
  });

  describe('check.and', function () {
    function isFoo(x) { return x === 'foo'; }

    it('combines predicate functions', function () {
      var predicate = check.and(check.unemptyString, isFoo);
      la(check.fn(predicate), 'got new predicate function');
      la(predicate('foo'), 'foo');
      la(!predicate(42), 'not for a number');
    });

    it('allows single function', function () {
      var predicate = check.and(check.number);
      la(predicate(10));
      la(!predicate(true));
    });

    it('handles non-function values as truthy', function () {
      var predicate = check.and(check.unemptyString, 42);
      la(!predicate());
      la(predicate('f'));
    });
  });

  describe('check/number', function () {
    it('does not pass nulls as numbers', function () {
      la(!check.number(null), 'null is not a number');
      la(check.not.number(null), 'null is .not.number');
    });

    it('does not pass undefined as numbers', function () {
      la(!check.number(undefined), 'undefined is not a number');
      la(check.not.number(undefined), 'undefined is .not.number');
    });

    it('does not pass NaN as numbers', function () {
      la(!check.number(NaN), 'NaN is not a number');
      la(check.not.number(NaN), 'NaN is .not.number');
    });
  });

  describe('check/validDate', function () {
    it('validates date', function () {
      la(check.validDate(new Date()), 'now date');
      la(check.validDate(new Date(2015, 1, 10)), '2015');
      la(!check.validDate(), 'undefined is not a valid date');
      la(!check.validDate(new Date(NaN)), 'NaN is not a valid date');
    });
  });

  describe('check/equal', function () {
    it('compares strings', function () {
      la(check.equal('foo', 'foo'), 'foo');
      la(!check.equal('foo', 'bar'), 'foo !== bar');
    });

    it('compares variable values', function () {
      var foo = 'foo',
        bar = 'bar';
      la(check.equal(foo, foo), 'foo');
      la(!check.equal(foo, bar), 'foo !== bar');
    });

    it('is curried', function () {
      var foo = 'foo';
      la(check.equal(foo, 'foo'), '2 arguments');
      var isFoo = check.equal('foo');
      la(check.fn(isFoo), 'returns function when 1 argument');
      la(isFoo('foo'), 'compares to foo');
      la(!isFoo('bar'), 'compares to bar');
    });
  });

  describe('check/promise', function () {
    it('checks objects api', function () {
      var p = {
        then: function () {},
        catch: function () {},
        finally: function () {}
      };
      la(check.promise(p));
      la(!check.promise({}));
      la(!check.promise('foo'));
      la(!check.promise());
    });

    it('does not throw exception when passed array', function () {
      la(!check.promise([]));
    });
  });

  describe('check/oneOf', function () {
    it('validates color', function () {
      var colors = ['red', 'green', 'blue'];
      var color = 'green';
      la(check.oneOf(colors, color), color, 'is one of', colors);
      la(!check.oneOf(colors, 'brown'));
    });
  });

  describe('check/arrayOf', function () {
    it('validates array of strings', function () {
      la(check.arrayOf(check.string, ['foo', '']));
    });

    it('validates array of empty strings', function () {
      la(!check.arrayOf(check.unemptyString, ['foo', '']));
      la(check.arrayOf(check.unemptyString, ['foo', 'bar']));
    });

    it('validates array of positive numbers', function () {
      la(check.arrayOf(check.positiveNumber, [10, 20, 30]));
    });

    it('validates schema for objects', function () {
      var person = {
        first: check.unemptyString,
        last: check.unemptyString
      };
      var isPerson = check.schema.bind(null, person);
      var arePeople = check.arrayOf.bind(null, isPerson);
      var people = [{
        first: 'foo',
        last: 'bar'
      }];
      la(arePeople(people), 'checked people');
    });
  });

  describe('check/badItems', function () {
    it('finds empty strings', function () {
      var empty = check.badItems(check.unemptyString, ['foo', '', 'bar']);
      la(check.array(empty), 'returns array');
      la(empty.length === 1, 'has single item');
      la(empty[0] === '', 'has empty string');
    });

    it('finds non strings', function () {
      var empty = check.badItems(check.string, ['foo', '', 'bar', 10]);
      la(check.array(empty), 'returns array');
      la(empty.length === 1, 'has single item');
      la(empty[0] === 10, 'has number');
    });
  });

  describe('check/shortCommitId', function () {
    /** @sample check/shortCommitId */
    it('shortCommitId', function () {
      la(check.shortCommitId('3b81980'));
    });
  });

  describe('check/commitId', function () {
    /** @sample check/commitId */
    it('commitId', function () {
      la(check.commitId('3b819803cdf2225ca1338beb17e0c506fdeedefc'));
    });
  });

  describe('check/index', function () {
    /** @sample check/index */
    it('index', function () {
      la(check.index('123', 0));
      la(check.index('123', 2));
      la(!check.index('123', 3));
      la(check.index(['foo', 'bar'], 0));
      la(check.index(['foo', 'bar'], 1));
      la(!check.index(['foo', 'bar'], 2));
    });
  });

  describe('check/then', function () {
    var done = false;
    function doIt() { done = true; }

    beforeEach(function () {
      done = false;
    });

    it('executes given function if condition is true', function () {
      la(!done, '!done initially');
      var safeDo = check.then(true, doIt);
      la(check.fn(safeDo), 'returns a new function');
      safeDo();
      la(done, 'safeDo was executed');
    });

    it('does not execute function if condition is false', function () {
      la(!done, '!done initially');
      var safeDo = check.then(false, doIt);
      safeDo();
      la(!done, 'safeDo was NOT executed');
    });

    it('can evaluate predicate function', function () {
      function isTrue() { return true; }
      var safeDo = check.then(isTrue, doIt);
      safeDo();
      la(done);
    });

    it('can evaluate predicate function (returns false)', function () {
      function isFalse() { return false; }
      var safeDo = check.then(isFalse, doIt);
      safeDo();
      la(!done);
    });

    it('can evaluate condition based on arguments', function () {
      function is3(a) {
        return a === 3;
      }
      var safeDo = check.then(is3, doIt);
      safeDo();
      la(!done, 'argument was not 3');

      safeDo(3);
      la(done, 'argument was 3');
    });

    it('handles multiple arguments', function () {
      function sumIs10(a, b) { return a + b === 10; }
      var safeDo = check.then(sumIs10, doIt);
      safeDo(4, 6);
      la(done, 'executed');
      done = false;
      safeDo(4, 4);
      la(!done, 'sum was not 10');
    });

    it('check.then', function () {
      function isSum10(a, b) { return a + b === 10; }
      function sum(a, b) { return a + b; }
      var onlyAddTo10 = check.then(isSum10, sum);
      // isSum10 returns true for these arguments
      // then sum is executed
      la(onlyAddTo10(3, 7) === 10);

      la(onlyAddTo10(1, 2) === undefined);
      // sum is never called because isSum10 condition is false
    });
  });

  /** @sample check/raises */
  describe('check.raises', function () {
    la(check.fn(check.raises), 'missing check.raises', check);

    function foo() {
      throw new Error('foo');
    }

    function bar() {}

    function isValidError(err) {
      return err.message === 'foo';
    }

    function isInvalid(err) {
      la(check.instance(err, Error), 'expected error');
      return false;
    }

    it('just checks if function raises error', function () {
      la(check.raises(foo));
      la(!check.raises(bar));
    });

    it('can validate error using second argument', function () {
      la(check.raises(foo, isValidError));
      la(!check.raises(foo, isInvalid));
    });
  });

  describe('check.raises example', function () {
    it('check.raises(fn, validator)', function () {
      function foo() {
        throw new Error('foo');
      }

      function bar() {}

      function isValidError(err) {
        return err.message === 'foo';
      }

      function isInvalid(err) {
        la(check.instance(err, Error), 'expected error');
        return false;
      }

      la(check.raises(foo));
      la(!check.raises(bar));
      la(check.raises(foo, isValidError));
      la(!check.raises(foo, isInvalid));
    });

    it('fails is validator is not a function', function () {
      function foo() {
        throw new Error('foo');
      }
      la(!check.raises(foo, 'validator'));
    });
  });

  describe('check.same', function () {
    la(check.fn(check.same));

    /** @sample check/same */
    it('check.same', function () {
      var foo = {}, bar = {};
      la(check.same(foo, foo));
      la(!check.same(foo, bar));

      // primitives are compared by value
      la(check.same(0, 0));
      la(check.same('foo', 'foo'));
    });

  });

  describe('check.allSame', function () {
    la(check.fn(check.allSame));

    it('returns false for non arrays', function () {
      la(!check.allSame('foo'));
      la(!check.allSame());
      la(check.allSame([]));
    });

    /** @sample check/allSame */
    it('check.allSame', function () {
      var foo = {}, bar = {};
      la(check.allSame([foo, foo, foo]));
      la(!check.allSame([foo, foo, bar]));

      // primitives are compared by value
      la(check.allSame([0, 0]));
      la(check.allSame(['foo', 'foo', 'foo']));
      la(!check.allSame([false, 0]));
    });
  });

  describe('check.defined', function () {
    la(check.fn(check.bit));

    /** @sample check/defined */
    it('detects defined or not', function () {
      la(check.defined(0));
      la(check.defined(1));
      la(check.defined(true));
      la(check.defined(false));
      la(check.defined(null));
      la(check.defined(''));
      la(!check.defined());
      la(!check.defined(root.doesNotExist));
      la(!check.defined({}.doesNotExist));
    });

    it('check.defined', function () {
      la(check.defined(0));
      la(check.defined(1));
      la(check.defined(true));
      la(check.defined(false));
      la(check.defined(null));
      la(check.defined(''));
      la(!check.defined());
      la(!check.defined(root.doesNotExist));
      la(!check.defined({}.doesNotExist));
    });
  });

  describe('check.bool', function () {
    la(check.fn(check.bool));

    it('check.bool', function () {
      la(check.bool(true));
      la(check.bool(false));
      la(!check.bool(0));
      la(!check.bool(1));
      la(!check.bool('1'));
      la(!check.bool(2));
    });
  });

  describe('check.git', function () {
    /** @sample check/git */
    it('detects git url', function () {
      la(check.git('git@github.com:kensho/check-more-types.git'));
    });
  });

  describe('check.bit', function () {
    la(check.fn(check.bit));

    /** @sample check/bit */
    it('detects 0/1', function () {
      la(check.bit(0));
      la(check.bit(1));
      la(!check.bit('1'));
      la(!check.bit(false));
    });

    it('passes', function () {
      la(check.bit(0));
      la(check.bit(1));
    });

    it('fails', function () {
      la(!check.bit('0'));
      la(!check.bit('1'));
      la(!check.bit(2));
      la(!check.bit(true));
      la(!check.bit(false));
    });

    it('check.bit', function () {
      la(check.bit(0));
      la(check.bit(1));
      la(!check.bit('1'));
      la(!check.bit(2));
      la(!check.bit(true));
    });
  });

  describe('check.unemptyArray', function () {
    la(check.fn(check.unemptyArray));

    /** @sample check/defined */
    it('check.unemptyArray', function () {
      la(!check.unemptyArray(null));
      la(!check.unemptyArray(1));
      la(!check.unemptyArray({}));
      la(!check.unemptyArray([]));
      la(!check.unemptyArray(root.doesNotExist));
      la(check.unemptyArray([1]));
      la(check.unemptyArray(['foo', 'bar']));
    });

  });

  describe('verify.all', function () {
    it('is a function', function () {
      la(check.fn(check.all));
      la(check.fn(check.verify.all));
    });

    it('requires arguments', function () {
      la(check.raises(function () {
        check.all();
      }));

      la(check.raises(function () {
        check.verify.all();
      }));

      la(check.raises(function () {
        check.verify.all({});
      }));
    });

    it('accepts empty objects', function () {
      la(check.all({}, {}));
      check.verify.all({}, {}, 'empty objects');
    });

    it('does nothing if everything is correct', function () {
      check.verify.all({
        foo: 'foo'
      }, {
        foo: check.unemptyString
      }, 'foo property');
    });

    it('throws an error if a property does not pass', function () {
      la(check.raises(function () {
        check.verify.all({
          foo: 'foo'
        }, {
          foo: check.number
        }, 'foo property');
      }));
    });

    it('fails if a predicate is not a function', function () {
      la(check.raises(function () {
        check.all({}, {
          foo: check.doesNotExistCheck
        });
      }));
    });

    describe('check.all partial', function () {
      it('check.all', function () {
        var obj = {
          foo: 'foo',
          bar: 'bar',
          baz: 'baz'
        };
        var predicates = {
          foo: check.unemptyString,
          bar: function (value) {
            return value === 'bar';
          }
        };
        la(check.all(obj, predicates));
      });

      /** @sample check/all */
      it('checks an object', function () {
        function fooChecker(value) {
          return value === 'foo';
        }
        la(check.all({ foo: 'foo' }, { foo: fooChecker }));
      });

      /** @sample check/all */
      it('extra properties are allowed', function () {
        var obj = {
          foo: 'foo',
          bar: 'bar'
        };
        var predicates = {
          foo: check.unemptyString
        };
        la(check.all(obj, predicates));
      });

      it('succeeds if there are extra properties', function () {
        la(check.all({
          foo: 'foo',
          bar: 'bar'
        }, {
          foo: check.unemptyString
        }));
      });

      it('succeeds if there are extra false properties', function () {
        la(check.all({
          foo: 'foo',
          bar: false
        }, {
          foo: check.unemptyString
        }));
      });
    });
  });

  describe('check.schema', function () {
    la(check.fn(check.schema));

    it('check.schema', function () {
      var obj = {
        foo: 'foo',
        bar: 'bar',
        baz: 'baz'
      };
      var schema = {
        foo: check.unemptyString,
        bar: function (value) {
          return value === 'bar';
        }
      };
      la(check.schema(schema, obj));
      la(!check.schema(schema, {}));
    });

    it('check.schema bind', function () {
      var personSchema = {
        name: check.unemptyString,
        age: check.positiveNumber
      };
      var isValidPerson = check.schema.bind(null, personSchema);
      var h1 = {
        name: 'joe',
        age: 10
      };
      var h2 = {
        name: 'ann'
        // missing age property
      };
      la(isValidPerson(h1));
      la(!isValidPerson(h2));
    });

    describe('nesting schemas', function () {
      var personSchema = {
        name: check.unemptyString,
        age: check.positiveNumber
      };
      var isValidPerson = check.schema.bind(null, personSchema);

      it('schema composition', function () {
        var teamSchema = {
          manager: isValidPerson,
          members: check.unemptyArray
        };
        var team = {
          manager: {
            name: 'jim',
            age: 20
          },
          members: ['joe', 'ann']
        };
        la(check.schema(teamSchema, team));
      });
    });
  });

  describe('arrayOfStrings', function () {
    it('has check', function () {
      la(check.fn(check.arrayOfStrings));
      la(check.fn(check.verify.arrayOfStrings));
    });

    it('check.arrayOfStrings', function () {
      // second argument is checkLowerCase
      la(check.arrayOfStrings(['foo', 'Foo']));
      la(!check.arrayOfStrings(['foo', 'Foo'], true));
      la(check.arrayOfStrings(['foo', 'bar'], true));
      la(!check.arrayOfStrings(['FOO', 'BAR'], true));
    });

    it('checks if strings are lower case', function () {
      la(check.arrayOfStrings(['foo', 'Foo']));
      la(!check.arrayOfStrings(['foo', 'Foo'], true));
      la(check.arrayOfStrings(['foo', 'bar'], true));
      la(!check.arrayOfStrings(['FOO', 'BAR'], true));
    });

    it('passes', function () {
      la(check.arrayOfStrings([]));
      la(check.arrayOfStrings(['foo']));
      la(check.arrayOfStrings(['foo', 'bar']));

      check.verify.arrayOfStrings([]);
      check.verify.arrayOfStrings(['foo']);
      check.verify.arrayOfStrings(['foo', 'bar']);
    });

    it('fails', function () {
      la(check.raises(function () {
        check.verify.arrayOfStrings('foo');
      }));

      la(check.raises(function () {
        check.verify.arrayOfStrings([1]);
      }));

      la(check.raises(function () {
        check.verify.arrayOfStrings(['foo', 1]);
      }));
    });

    /** @sample check/arrayOfStrings */
    it('works', function () {
      la(check.arrayOfStrings(['foo', 'BAR']));
      la(!check.arrayOfStrings(['foo', 4]));
      // can check lower case
      la(!check.arrayOfStrings(['foo', 'Bar'], true));
      // lower case flag should be boolean
      la(check.arrayOfStrings(['foo', 'Bar'], 1));
    });

  });

  describe('arrayOfArraysOfStrings', function () {
    it('has check', function () {
      la(check.fn(check.arrayOfArraysOfStrings));
      la(check.fn(check.verify.arrayOfArraysOfStrings));
    });

    it('check.arrayOfArraysOfStrings', function () {
      // second argument is checkLowerCase
      la(check.arrayOfArraysOfStrings([['foo'], ['bar']]));
      la(check.arrayOfArraysOfStrings([['foo'], ['bar']], true));
      la(!check.arrayOfArraysOfStrings([['foo'], ['BAR']], true));
    });

    /** @sample check/arrayOfArraysOfStrings */
    it('checks if all strings are lower case', function () {
      la(check.arrayOfArraysOfStrings([['foo'], ['bar']]));
      la(check.arrayOfArraysOfStrings([['foo'], ['bar']], true));
      la(!check.arrayOfArraysOfStrings([['foo'], ['BAR']], true));
    });

    it('returns true', function () {
      la(check.arrayOfArraysOfStrings([[]]));
      la(check.arrayOfArraysOfStrings([['foo'], ['bar']]));
    });

    it('returns false', function () {
      la(!check.arrayOfArraysOfStrings([['foo', true]]));
      la(!check.arrayOfArraysOfStrings([['foo'], ['bar'], [1]]));
    });

    it('passes', function () {
      check.verify.arrayOfArraysOfStrings([[]]);
      check.verify.arrayOfArraysOfStrings([['foo']]);
      check.verify.arrayOfArraysOfStrings([['foo'], ['bar'], []]);
    });

    it('fails', function () {
      la(check.raises(function () {
        check.verify.arrayOfArraysOfStrings('foo');
      }));

      la(check.raises(function () {
        check.verify.arrayOfArraysOfStrings([1]);
      }));

      la(check.raises(function () {
        check.verify.arrayOfArraysOfStrings(['foo', 1]);
      }));

      la(check.raises(function () {
        check.verify.arrayOfArraysOfStrings([['foo', 1]]);
      }));
    });
  });

  describe('lowerCase', function () {
    it('check.lowerCase', function () {
      la(check.lowerCase('foo bar'));
      la(check.lowerCase('*foo ^bar'));
      la(!check.lowerCase('fooBar'));
      // non-strings return false
      la(!check.lowerCase(10));
    });

    /** @sample check/lowerCase */
    it('checks lower case', function () {
      la(check.lowerCase('foo bar'));
      la(check.lowerCase('*foo ^bar'));
      la(!check.lowerCase('fooBar'));
    });

    it('passes lower case with spaces', function () {
      la(check.lowerCase('foo'));
      la(check.lowerCase('foo bar'));
      la(check.lowerCase('  foo bar  '));
    });

    it('handles special chars', function () {
      la(check.lowerCase('^tea'));
      la(check.lowerCase('$tea'));
      la(check.lowerCase('s&p 500'));
    });

    it('rejects upper case', function () {
      la(!check.lowerCase('Foo'));
      la(!check.lowerCase('FOO '));
      la(!check.lowerCase('FOO BAR'));
      la(!check.lowerCase('foo bAr'));
    });

    it('returns true', function () {
      la(check.fn(check.lowerCase), 'it is a function');
      la(check.lowerCase('foo 2 []'));
      la(check.lowerCase('-_foo_ and another bar'));
    });

    it('returns false', function () {
      la(!check.lowerCase('FoO'));
    });

    it('returns false for non strings', function () {
      la(!check.lowerCase([]));
      la(!check.lowerCase(7));
      la(!check.lowerCase({ foo: 'foo' }));
    });
  });

  describe('has', function () {
    it('check.has(obj, property)', function () {
      var obj = {
        foo: 'foo',
        bar: 0
      };
      la(check.has(obj, 'foo'));
      la(check.has(obj, 'bar'));
      la(!check.has(obj, 'baz'));
      // non-object returns false
      la(!check.has(5, 'foo'));
      la(check.has('foo', 'length'));
    });

    it('complaints if there is no property argument', function () {
      var obj = {};
      var crashed = true;
      try {
        check.has(obj);
        crashed = false;
      } catch (err) {}
      la(crashed, 'has not crashed when checking non-existent property');
    });

    it('passes', function () {
      var o = {
        foo: '',
        bar: 'something',
        baz: 0
      };
      la(check.fn(check.has));
      la(check.has(o, 'foo'));
      la(check.has(o, 'bar'));
      la(check.has(o, 'baz'));
    });

    /** @example check/has */
    it('works for non-objects', function () {
      la(check.has('str', 'length'), 'string length');
      la(check.has([], 'length'), 'array length');
    });

    it('fails for invalid args', function () {
      la(check.raises(check.has), 'no arguments');
      la(check.raises(check.has.bind(check, {})), 'no property name');
      la(!check.has({}, 99), 'invalid property name');
      la(!check.has({}, ''), 'empty property name');
    });

    it('fails for missing properties', function () {
      la(!check.has({}, 'foo'));
    });
  });

  describe('maybe modifier', function () {
    it('default maybe from check-types.js', function () {
      la(check.object(check.maybe), 'check.maybe is an object');
      la(check.fn(check.maybe.fn), 'check.maybe.fn function');
      la(check.maybe.fn(), 'undefined is maybe a function');
      la(check.maybe.fn(null), 'null is maybe a function');
    });

    it('check.maybe.bit', function () {
      la(check.fn(check.maybe.bit), 'check.maybe.bit function');
      la(check.maybe.bit(1));
      la(check.maybe.bit());
      la(check.maybe.bit(null));
      la(!check.maybe.bit(4));
    });

    it('check.maybe other functions', function () {
      la(check.maybe.bool());
      la(!check.maybe.bool('true'));
    });

    it('check.maybe', function () {
      la(check.maybe.bool(), 'undefined is maybe bool');
      la(!check.maybe.bool('true'));
      var empty;
      la(check.maybe.lowerCase(empty));
      la(check.maybe.unemptyArray());
      la(!check.maybe.unemptyArray([]));
      la(check.maybe.unemptyArray(['foo', 'bar']));
    });
  });

  describe('not modifier', function () {
    it('default not from check-types.js', function () {
      la(check.object(check.not), 'check.not is an object');
      la(check.fn(check.not.fn), 'check.maybe.fn function');
      la(check.not.fn(), 'undefined is not a function');
      la(check.not.fn(null), 'null is not a function');
    });

    it('check.not.bit', function () {
      la(check.fn(check.not.bit), 'check.not.bit function');
      la(!check.not.bit(1), '! 1 is not a bit');
      la(check.not.bit());
      la(check.not.bit(null));
      la(check.not.bit(4), '4 is not a bit');
    });

    it('check.not other functions', function () {
      la(check.not.bool());
      la(check.not.bool('true'));
      la(!check.not.bool(true));
    });

    it('check.not', function () {
      la(check.not.bool(4), '4 is not bool');
      la(check.not.bool('true'), 'string true is not a bool');
      la(!check.not.bool(true), 'true is a bool');
    });
  });

  describe('adding custom predicate', function () {
    it('check.mixin(predicate)', function () {
      la(!check.foo, 'there is no check.foo');
      // new predicate to be added. Should have function name
      function foo(a) {
        return a === 'foo';
      }
      check.mixin(foo);
      la(check.fn(check.foo), 'foo has been added to check');
      la(check.fn(check.maybe.foo), 'foo has been added to check.maybe');
      la(check.fn(check.not.foo), 'foo has been added to check.not');
      la(check.foo('foo'));
      la(check.maybe.foo('foo'));
      la(check.not.foo('bar'));

      // you can provide name
      function isBar(a) {
        return a === 'bar';
      }
      check.mixin(isBar, 'bar');
      la(check.bar('bar'));
      la(!check.bar('anything else'));

      // does NOT overwrite predicate if already exists
      la(check.bar === isBar, 'predicate has been registered');
      check.mixin(foo, 'bar');
      la(check.bar === isBar, 'old check predicate remains');
      delete check.foo;
      delete check.bar;
    });

    it('check.mixin(predicate, name)', function () {
      function isBar(a) {
        return a === 'bar';
      }
      check.mixin(isBar, 'bar');
      la(check.bar('bar'));
      la(!check.bar('anything else'));
      // supports modifiers
      la(check.maybe.bar());
      la(check.maybe.bar('bar'));
      la(check.not.bar('foo'));
      la(!check.not.bar('bar'));
    });

    it('check.mixin(name, predicate)', function () {
      function isItFoo(a) {
        return a === 'foo';
      }
      check.mixin('isItFooA', isItFoo);
      la(check.isItFooA('foo'), 'it is not foo');
    });

    it('check.mixin(predicate)', function () {
      // will use function name if just passed a function
      function isBar(a) {
        return a === 'bar';
      }
      check.mixin(isBar);
      la(check.isBar('bar'));
    });

    it('check.mixin does not override', function () {
      function isFoo(a) {
        return a === 'foo';
      }
      function isBar(a) {
        return a === 'bar';
      }
      check.mixin(isFoo, 'isFoo');
      la(check.isFoo === isFoo, 'predicate has been registered');
      check.mixin(isBar, 'isFoo');
      la(check.isFoo === isFoo, 'old check predicate remains');
    });
  });

  describe('check.verify extras', function () {
    it('has extra methods', function () {
      la(check.object(check.verify));
      la(check.fn(check.verify.lowerCase));
    });

    it('check.verify', function () {
      check.verify.arrayOfStrings(['foo', 'bar']);
      check.verify.bit(1);

      function nonStrings() {
        check.verify.arrayOfStrings(['Foo', 1]);
      }

      la(check.raises(nonStrings));


      function nonLowerCase() {
        check.verify.lowerCase('Foo');
      }

      la(check.raises(nonLowerCase));
    });
  });

  describe('defend', function () {
    it('protects a function without predicates', function () {
      la(check.fn(check.defend));
      function add(a, b) { return a + b; }
      var safeAdd = check.defend(add);
      la(check.fn(safeAdd), 'returns defended function');
      la(safeAdd !== add, 'it is not the same function');
      la(add(2, 3) === 5, 'original function works');
      la(safeAdd(2, 3) === 5, 'protected function works');
    });

    it('protects a function', function () {
      function add(a, b) { return a + b; }
      var safeAdd = check.defend(add, check.number, check.number);
      la(add('foo', 2) === 'foo2',
        'adding string to number works just fine');
      la(check.raises(safeAdd.bind(null, 'foo', 2), function (err) {
        console.log(err);
        return /foo/.test(err.message);
      }), 'trying to add string to number breaks');
    });

    it('protects optional arguments', function () {
      function add(a, b) {
        if (typeof b === 'undefined') {
          return 'foo';
        }
        return a + b;
      }
      la(add(2) === 'foo');
      var safeAdd = check.defend(add, check.number, check.maybe.number);
      la(safeAdd(2, 3) === 5);
      la(safeAdd(2) === 'foo');
    });

    it('can have string messages', function () {
      function add(a, b) { return a + b; }
      la(add('foo', 2) === 'foo2');

      var safeAdd = check.defend(add,
        check.number, 'a should be a number');
      la(safeAdd(2, 3) === 5, '2 + 3 === 5');

      function addStringToNumber() {
        return safeAdd('foo', 2);
      }
      function checkException(err) {
        la(check.defined(err), 'got error object');
        la(/foo/.test(err.message),
          'has offending argument value', err.message);
        la(/a should be a number/.test(err.message),
          'has defensive message', err.message);
        return true;
      }
      la(check.raises(addStringToNumber, checkException),
        'defends against string instead of number');
    });

    // API doc examples
    it('check.defend(fn, predicates)', function () {
      function add(a, b) { return a + b; }
      var safeAdd = check.defend(add, check.number, check.number);
      la(add('foo', 2) === 'foo2', 'adding string to number works just fine');
      // calling safeAdd('foo', 2) raises an exception
      la(check.raises(safeAdd.bind(null, 'foo', 2)));
    });

    it('check.defend in module pattern', function () {
      var add = (function () {
        // inner private function without any argument checks
        function add(a, b) {
          return a + b;
        }
        // return defended function
        return check.defend(add, check.number, check.number);
      }());
      la(add(2, 3) === 5);
      // trying to call with non-numbers raises an exception
      function callAddWithNonNumbers() {
        return add('foo', 'bar');
      }
      la(check.raises(callAddWithNonNumbers));
    });

    it('check.defend with messages', function () {
      function add(a, b) { return a + b; }
      var safeAdd = check.defend(add,
        check.number, 'a should be a number',
        check.string, 'b should be a string');
      la(safeAdd(2, 'foo') === '2foo');

      function addNumbers() {
        return safeAdd(2, 3);
      }
      function checkException(err) {
        la(err.message === 'Argument 2: 3 does not pass predicate: b should be a string');
        return true;
      }
      la(check.raises(addNumbers, checkException));
    });
  });

  describe('check.sameLength', function () {
    /** @sample check/sameLength */
    it('check.sameLength', function () {
      la(check.sameLength([1, 2], ['a', 'b']));
      la(check.sameLength('ab', 'cd'));
      // different types
      la(!check.sameLength([1, 2], 'ab'));
    });
  });

  describe('check.unit', function () {
    /** @sample check/unit */
    it('check.unit', function () {
      la(check.unit(0));
      la(check.unit(1));
      la(check.unit(0.1));
      la(!check.unit(1.2));
      la(!check.unit(-0.1));
    });

    it('check.unit edge cases', function () {
      la(check.unit(0));
      la(check.unit(1));
      la(check.unit(0.1));
      la(check.unit(0.00001));

      la(!check.unit(-0.1));
      la(!check.unit(-1));
      la(!check.unit(10));
      la(!check.unit(-10));
      la(!check.unit('0.1'));
    });
  });

  describe('check.hexRgb', function () {
    /** @sample check/hexRgb */
    it('check.hexRgb', function () {
      la(check.hexRgb('#FF00FF'));
      la(check.hexRgb('#000'));
      la(check.hexRgb('#aaffed'));
      la(!check.hexRgb('#00aaffed'));
      la(!check.hexRgb('aaffed'));
    });

    it('check.hexRgb works', function () {
      la(check.hexRgb('#ffffff'));
      la(check.hexRgb('#FF00FF'));
      la(check.hexRgb('#000'));
      la(check.hexRgb('#000000'));
    });

    it('fails for other cases', function () {
      la(!check.hexRgb('ffffff'));
      la(!check.hexRgb('#FF00FFF'));
      la(!check.hexRgb('#ggjjaa'));
      la(!check.hexRgb('#000000#'));
      la(!check.hexRgb('red'));
    });
  });

  describe('check.empty', function () {
    /** @sample check/empty */
    it('check.empty', function () {
      la(check.empty([]));
      la(check.empty(''));
      la(check.empty({}));
      la(!check.empty(0));
      la(!check.empty(['foo']));
    });
  });

  describe('check.unempty', function () {
    /** @sample check/unempty */
    it('check.unempty', function () {
      la(!check.unempty([]));
      la(!check.unempty(''));
      la(!check.unempty({}));
      la(check.unempty(0));
      la(check.unempty(['foo']));
      la(check.unempty('foo'));
    });
  });

  describe('check.emptyString', function () {
    it('is defined', function () {
      la(check.fn(check.emptyString));
    });

    /** @sample check/emptyString */
    it('check.emptyString', function () {
      la(check.emptyString(''));
      la(!check.emptyString(' '));
      la(!check.emptyString(0));
      la(!check.emptyString([]));
    });
  });
});
