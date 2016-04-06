'use strict'

/* global describe, it */
describe('check-more-types low-level predicates', function () {
  const la = require('lazy-ass')
  const low = require('./low-level')
  const check = require('..')

  it('is an object', function () {
    la(check.object(low))
  })

  it('has extra checks', function () {
    la(check.fn(low.bit))
    la(check.fn(low.lowerCase))
  })

  it('has emptyObject', function () {
    la(check.fn(low.emptyObject))
    la(low.emptyObject({}))
    la(!low.emptyObject([]), 'empty array is not an empty object')
    la(!low.emptyObject(''), 'empty string is not an empty object')
  })

  describe('error', function () {
    it('returns true if given argument is Error', function () {
      la(low.error(new Error('foo')))
    })

    it('returns false for everything else', function () {
      la(check.not.error('foo'))
    })
  })

  describe('check.length', function () {
    it('has check.length', function () {
      la(!check.length({}, 0))
      la(check.length('', 0))
      la(check.length([1, 2], 2))
    })

    it('is curried', function () {
      la(check.length('foo')(3), 'string')
      la(check.length([1, 2])(2), 'array')
    })

    it('knows the order of arguments', function () {
      la(check.length('foo', 3), 'string, number')
      la(check.length(3, 'foo'), 'number, string')
    })

    it('curried and knows the order of arguments', function () {
      la(check.length(3)('foo'), 'number, string')
      la(check.length('foo')(3), 'string, number')
    })
  })

  it('has floatNumber', function () {
    la(check.fn(check.floatNumber))
    la(check.floatNumber(1.1), '1.1 is a float')
    la(!check.floatNumber(1))
    la(!check.floatNumber('one'))
  })

  it('has intNumber', function () {
    la(check.fn(check.intNumber))
    la(!check.intNumber(1.1), '1.1 is a float')
    la(check.intNumber(1))
    la(!check.intNumber('one'))
  })

  describe('check.primitive', function () {
    it('returns true for primitive javascript types', function () {
      la(check.primitive(42), 'number')
      la(check.primitive(true), 'boolean')
      la(check.primitive('foo'), 'string')
      if (typeof Symbol === 'function') {
        /* global Symbol */
        la(check.primitive(Symbol('test')), 'symbol')
      }
    })

    it('returns false for objects, arrays and functions', function () {
      la(!check.primitive([]), 'array')
      la(!check.primitive(describe), 'function')
      la(!check.primitive({}), 'object')
    })
  })

  describe('check.zero', function () {
    it('returns true if the argument is a number 0', function () {
      la(check.zero(0), '0')
      la(!check.zero(), 'not for undefined')
      la(!check.zero(null), 'not for null')
    })

    it('edge cases', function () {
      la(!check.not.zero(0))
    })
  })

  describe('check/number', function () {
    it('does not pass nulls as numbers', function () {
      la(!check.number(null), 'null is not a number')
      la(check.not.number(null), 'null is .not.number')
    })

    it('does not pass undefined as numbers', function () {
      la(!check.number(undefined), 'undefined is not a number')
      la(check.not.number(undefined), 'undefined is .not.number')
    })

    it('does not pass NaN as numbers', function () {
      la(!check.number(NaN), 'NaN is not a number')
      la(check.not.number(NaN), 'NaN is .not.number')
    })

    it('does not pass Infinity as numbers', function () {
      la(!check.number(Infinity), 'Infinity is not a number')
      la(!check.number(-Infinity), '-Infinity is not a number')
      la(check.not.number(Infinity), 'Infinity is .not.number')
    })
  })

  describe('check/regexp', function () {
    it('passes regular expressions', function () {
      la(check.regexp(/foo/))
    })

    it('rejects other values', function () {
      la(!check.regexp('foo'))
      la(!check.regexp(), 'empty value')
    })
  })

  describe('check/validDate', function () {
    it('validates date', function () {
      la(check.validDate(new Date()), 'now date')
      la(check.validDate(new Date(2015, 1, 10)), '2015')
      la(!check.validDate(), 'undefined is not a valid date')
      la(!check.validDate(new Date(NaN)), 'NaN is not a valid date')
    })
  })

  describe('check/equal', function () {
    it('compares strings', function () {
      la(check.equal('foo', 'foo'), 'foo')
      la(!check.equal('foo', 'bar'), 'foo !== bar')
    })

    it('compares variable values', function () {
      var foo = 'foo'
      var bar = 'bar'
      la(check.equal(foo, foo), 'foo')
      la(!check.equal(foo, bar), 'foo !== bar')
    })

    it('is curried', function () {
      var foo = 'foo'
      la(check.equal(foo, 'foo'), '2 arguments')
      var isFoo = check.equal('foo')
      la(check.fn(isFoo), 'returns function when 1 argument')
      la(isFoo('foo'), 'compares to foo')
      la(!isFoo('bar'), 'compares to bar')
    })
  })

  describe('check.same', function () {
    la(check.fn(check.same))

    /** @sample check/same */
    it('check.same', function () {
      var foo = {}
      var bar = {}
      la(check.same(foo, foo))
      la(!check.same(foo, bar))

      // primitives are compared by value
      la(check.same(0, 0))
      la(check.same('foo', 'foo'))
    })
  })

  describe('check.defined', function () {
    la(check.fn(check.bit))

    /** @sample check/defined */
    it('detects defined or not', function () {
      la(check.defined(0))
      la(check.defined(1))
      la(check.defined(true))
      la(check.defined(false))
      la(check.defined(null))
      la(check.defined(''))
      la(!check.defined())
      la(!check.defined(root.doesNotExist))
      la(!check.defined({}.doesNotExist))
    })

    it('check.defined', function () {
      la(check.defined(0))
      la(check.defined(1))
      la(check.defined(true))
      la(check.defined(false))
      la(check.defined(null))
      la(check.defined(''))
      la(!check.defined())
      la(!check.defined(root.doesNotExist))
      la(!check.defined({}.doesNotExist))
    })
  })

  describe('check.bool', function () {
    la(check.fn(check.bool))

    it('check.bool', function () {
      la(check.bool(true))
      la(check.bool(false))
      la(!check.bool(0))
      la(!check.bool(1))
      la(!check.bool('1'))
      la(!check.bool(2))
    })
  })

  describe('check.bit', function () {
    la(check.fn(check.bit))

    /** @sample check/bit */
    it('detects 0/1', function () {
      la(check.bit(0))
      la(check.bit(1))
      la(!check.bit('1'))
      la(!check.bit(false))
    })

    it('passes', function () {
      la(check.bit(0))
      la(check.bit(1))
    })

    it('fails', function () {
      la(!check.bit('0'))
      la(!check.bit('1'))
      la(!check.bit(2))
      la(!check.bit(true))
      la(!check.bit(false))
    })

    it('check.bit', function () {
      la(check.bit(0))
      la(check.bit(1))
      la(!check.bit('1'))
      la(!check.bit(2))
      la(!check.bit(true))
    })
  })

  describe('positive and negative numbers', function () {
    it('has aliases', function () {
      la(check.fn(check.positiveNumber))
      la(check.fn(check.positive))
      la(check.fn(check.negativeNumber))
      la(check.fn(check.negative))
    })

    it('works for negative numbers', function () {
      la(check.negative(-1))
      la(check.negativeNumber(-1000))
    })

    it('works for positive numbers', function () {
      la(check.not.positive(-1))
      la(check.positiveNumber(1000))
    })
  })

  describe('has', function () {
    it('check.has(obj, property)', function () {
      var obj = {
        foo: 'foo',
        bar: 0
      }
      la(check.has(obj, 'foo'))
      la(check.has(obj, 'bar'))
      la(!check.has(obj, 'baz'))
      // non-object returns false
      la(!check.has(5, 'foo'))
      la(check.has('foo', 'length'))
    })

    it('complaints if there is no property argument', function () {
      var obj = {}
      var crashed = true
      try {
        check.has(obj)
        crashed = false
      } catch (err) {}
      la(crashed, 'has not crashed when checking non-existent property')
    })

    it('passes', function () {
      var o = {
        foo: '',
        bar: 'something',
        baz: 0
      }
      la(check.fn(check.has))
      la(check.has(o, 'foo'))
      la(check.has(o, 'bar'))
      la(check.has(o, 'baz'))
    })

    /** @example check/has */
    it('works for non-objects', function () {
      la(check.has('str', 'length'), 'string length')
      la(check.has([], 'length'), 'array length')
    })

    it('fails for invalid args', function () {
      la(check.raises(check.has), 'no arguments')
      la(check.raises(check.has.bind(check, {})), 'no property name')
      la(!check.has({}, 99), 'invalid property name')
      la(!check.has({}, ''), 'empty property name')
    })

    it('fails for missing properties', function () {
      la(!check.has({}, 'foo'))
    })
  })

  describe('check.empty', function () {
    /** @sample check/empty */
    it('check.empty', function () {
      la(check.empty([]))
      la(check.empty(''))
      la(check.empty({}))
      la(!check.empty(0))
      la(!check.empty(['foo']))
    })
  })

  describe('check.unempty', function () {
    /** @sample check/unempty */
    it('check.unempty', function () {
      la(!check.unempty([]))
      la(!check.unempty(''))
      la(!check.unempty({}))
      la(check.unempty(0))
      la(check.unempty(['foo']))
      la(check.unempty('foo'))
    })
  })

  describe('check.emptyString', function () {
    it('is defined', function () {
      la(check.fn(check.emptyString))
    })

    /** @sample check/emptyString */
    it('check.emptyString', function () {
      la(check.emptyString(''))
      la(!check.emptyString(' '))
      la(!check.emptyString(0))
      la(!check.emptyString([]))
    })
  })

  describe('check.unemptyString', function () {
    it('is defined', function () {
      la(check.fn(check.unemptyString))
    })

    it('returns a boolean', function () {
      la(check.unemptyString('') === false)
      la(check.unemptyString(' ') === true)
    })

    it('can be combined with "verify"', function () {
      la(check.raises(function () {
        check.verify.unemptyString('')
      }))
    })
  })
})
