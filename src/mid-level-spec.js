'use strict'

/* global describe, it */
describe('check-more-types mid-level predicates', function () {
  var la = require('lazy-ass')
  var mid = require('./mid-level')
  var check = require('..')

  it('is an object', function () {
    la(check.object(mid))
  })

  describe('check/extension', function () {
    it('is a function', function () {
      la(check.fn(check.extension), 'has extension method')
    })

    it('has an alias', function () {
      la(check.extension === check.ext, 'has ext alias')
    })

    it('returns filename extension', function () {
      ['foo.txt', 'foo.bar.txt', 'foo/bar/baz.txt'].forEach(function (name) {
        la(check.extension('txt', name), 'not txt extension', name)
      })
    })

    it('is curried', function () {
      var isJs = check.extension('js')
      la(check.fn(isJs), 'returns new function')
      la(isJs('script.js'))
      la(!isJs('script.txt'))
    })

    it('is case sensitive', function () {
      var isJson = check.extension('json')
      la(isJson('filename.json'))
      la(!isJson('filename.json.JSON'))
    })

    it('has a few shortcuts for convenience', function () {
      la(check.isJson('filename.json'))
      la(check.isJs('foo/bar/baz.js'))
      la(check.isJpeg('foo/bar/baz-nice.jpg'))
      la(check.isJpg === check.isJpeg)
    })
  })

  it('check/even', function () {
    la(mid.even(2), '2 is even')
    la(mid.even(4), '4 is even')
    la(mid.even(0), '0 is even')
    la(!mid.even(1), '1 is not even')
    la(!mid.even(11), '11 is not even')
  })

  it('check/odd', function () {
    la(!mid.odd(2), '2 is not odd')
    la(!mid.odd(4), '4 is not odd')
    la(!mid.odd(0), '0 is not odd')
    la(mid.odd(1), '1 is odd')
    la(mid.odd(11), '11 is odd')
  })

  it('has startsWith', function () {
    la(check.startsWith('foo', 'foo-bar'))
    la(check.startsWith('foo', 'foo/bar'))
    la(check.startsWith('foo', 'foo/bar/foo'))
    la(!check.startsWith('foo', 'bar/foo'))
  })

  describe('check.type', function () {
    it('compares types', function () {
      la(check.type('string', 'foo'), 'string type')
      la(check.type('number', 42), 'number type')
      la(check.type('object', {}), 'object type')
    })

    it('tricky types', function () {
      var foo
      la(check.type('object', []), 'arrays are objects')
      la(check.type('undefined', foo), 'undefined reference')
      la(check.type('object', null), 'null is an object')
    })

    it('is curried', function () {
      var isNumber = check.type('number')
      la(check.fn(isNumber), 'returned number')
      la(isNumber(42), '42 is a number')
      la(!isNumber('foo'), 'foo is not a number')
    })
  })

  describe('check/found', function () {
    it('returns true for found indices', function () {
      la(check.found('foo'.indexOf('f')))
      la(check.found('foo'.indexOf('oo')))
      la(check.found('foo bar'.indexOf('bar')))
    })

    it('fails for negative numbers', function () {
      la(!check.found('foo'.indexOf('a')))
      la(!check.found(-1), '-1')
      la(!check.found(-2), '-2')
    })
  })

  describe('check/oneOf', function () {
    var colors = ['red', 'green', 'blue']
    var color = 'green'

    it('validates color', function () {
      la(check.oneOf(colors, color), color, 'is one of', colors)
      la(!check.oneOf(colors, 'brown'))
    })

    it('is curried', function () {
      la(check.oneOf(colors)('green'))
    })
  })

  describe('check/index', function () {
    /** @sample check/index */
    it('index', function () {
      la(check.index('123', 0))
      la(check.index('123', 2))
      la(!check.index('123', 3))
      la(check.index(['foo', 'bar'], 0))
      la(check.index(['foo', 'bar'], 1))
      la(!check.index(['foo', 'bar'], 2))
    })
  })

  /** @sample check/raises */
  describe('check.raises', function () {
    la(check.fn(check.raises), 'missing check.raises', check)

    function foo () {
      throw new Error('foo')
    }

    function bar () {}

    function isValidError (err) {
      return err.message === 'foo'
    }

    function isInvalid (err) {
      la(check.instance(err, Error), 'expected error')
      return false
    }

    it('just checks if function raises error', function () {
      la(check.raises(foo))
      la(!check.raises(bar))
    })

    it('can validate error using second argument', function () {
      la(check.raises(foo, isValidError))
      la(!check.raises(foo, isInvalid))
    })
  })

  describe('check.raises example', function () {
    it('check.raises(fn, validator)', function () {
      function foo () {
        throw new Error('foo')
      }

      function bar () {}

      function isValidError (err) {
        return err.message === 'foo'
      }

      function isInvalid (err) {
        la(check.instance(err, Error), 'expected error')
        return false
      }

      la(check.raises(foo))
      la(!check.raises(bar))
      la(check.raises(foo, isValidError))
      la(!check.raises(foo, isInvalid))
    })

    it('fails is validator is not a function', function () {
      function foo () {
        throw new Error('foo')
      }
      la(!check.raises(foo, 'validator'))
    })
  })

  describe('check.sameLength', function () {
    /** @sample check/sameLength */
    it('check.sameLength', function () {
      la(check.sameLength([1, 2], ['a', 'b']))
      la(check.sameLength('ab', 'cd'))
      // different types
      la(!check.sameLength([1, 2], 'ab'))
    })
  })

  describe('check.unit', function () {
    /** @sample check/unit */
    it('check.unit', function () {
      la(check.unit(0))
      la(check.unit(1))
      la(check.unit(0.1))
      la(!check.unit(1.2))
      la(!check.unit(-0.1))
    })

    it('check.unit edge cases', function () {
      la(check.unit(0))
      la(check.unit(1))
      la(check.unit(0.1))
      la(check.unit(0.00001))

      la(!check.unit(-0.1))
      la(!check.unit(-1))
      la(!check.unit(10))
      la(!check.unit(-10))
      la(!check.unit('0.1'))
    })
  })

  describe('check.hexRgb', function () {
    /** @sample check/hexRgb */
    it('check.hexRgb', function () {
      la(check.hexRgb('#FF00FF'))
      la(check.hexRgb('#000'))
      la(check.hexRgb('#aaffed'))
      la(!check.hexRgb('#00aaffed'))
      la(!check.hexRgb('aaffed'))
    })

    it('check.hexRgb works', function () {
      la(check.hexRgb('#ffffff'))
      la(check.hexRgb('#FF00FF'))
      la(check.hexRgb('#000'))
      la(check.hexRgb('#000000'))
    })

    it('fails for other cases', function () {
      la(!check.hexRgb('ffffff'))
      la(!check.hexRgb('#FF00FFF'))
      la(!check.hexRgb('#ggjjaa'))
      la(!check.hexRgb('#000000#'))
      la(!check.hexRgb('red'))
    })
  })

  describe('check/contains', function () {
    it('is a function', function () {
      la(check.fn(check.contains))
    })

    /** @sample check/contains */
    it('contains item in an array', function () {
      var items = ['foo', 1, 'bar']
      la(check.contains(items, 'foo'))
      la(check.contains(items, 1))
      la(check.contains(items, 'bar'))
      la(check.not.contains(items, 42))
    })

    /** @sample check/contains */
    it('contains substring', function () {
      var str = 'foo bar baz'
      la(check.contains(str, 'foo'))
      la(check.contains(str, 'bar'))
      la(check.contains(str, 'r ba'))
      la(check.not.contains(str, 'foobar'))
    })
  })

  describe('check.allSame', function () {
    la(check.fn(check.allSame))

    it('returns false for non arrays', function () {
      la(!check.allSame('foo'))
      la(!check.allSame())
      la(check.allSame([]))
    })

    /** @sample check/allSame */
    it('check.allSame', function () {
      var foo = {}
      var bar = {}
      la(check.allSame([foo, foo, foo]))
      la(!check.allSame([foo, foo, bar]))

      // primitives are compared by value
      la(check.allSame([0, 0]))
      la(check.allSame(['foo', 'foo', 'foo']))
      la(!check.allSame([false, 0]))
    })
  })
})
