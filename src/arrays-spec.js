'use strict'

/* global describe, it */
describe('check-more-types array predicates', function () {
  const la = require('lazy-ass')
  const check = require('..')

  it('is an object', function () {
    const arrays = require('./arrays')
    la(check.object(arrays))
  })

  describe('check/arrayOf', function () {
    it('validates array of strings', function () {
      la(check.arrayOf(check.string, ['foo', '']))
    })

    it('validates array of empty strings', function () {
      la(!check.arrayOf(check.unemptyString, ['foo', '']))
      la(check.arrayOf(check.unemptyString, ['foo', 'bar']))
    })

    it('validates array of positive numbers', function () {
      la(check.arrayOf(check.positiveNumber, [10, 20, 30]))
    })

    it('validates schema for objects', function () {
      var person = {
        first: check.unemptyString,
        last: check.unemptyString
      }
      var isPerson = check.schema.bind(null, person)
      var arePeople = check.arrayOf.bind(null, isPerson)
      var people = [{
        first: 'foo',
        last: 'bar'
      }]
      la(arePeople(people), 'checked people')
    })
  })

  describe('check/badItems', function () {
    it('finds empty strings', function () {
      var empty = check.badItems(check.unemptyString, ['foo', '', 'bar'])
      la(check.array(empty), 'returns array')
      la(empty.length === 1, 'has single item')
      la(empty[0] === '', 'has empty string')
    })

    it('finds non strings', function () {
      var empty = check.badItems(check.string, ['foo', '', 'bar', 10])
      la(check.array(empty), 'returns array')
      la(empty.length === 1, 'has single item')
      la(empty[0] === 10, 'has number')
    })
  })

  describe('check.unemptyArray', function () {
    la(check.fn(check.unemptyArray))

    /** @sample check/defined */
    it('check.unemptyArray', function () {
      la(!check.unemptyArray(null))
      la(!check.unemptyArray(1))
      la(!check.unemptyArray({}))
      la(!check.unemptyArray([]))
      la(!check.unemptyArray(root.doesNotExist))
      la(check.unemptyArray([1]))
      la(check.unemptyArray(['foo', 'bar']))
    })
  })

  describe('arrayOfStrings', function () {
    it('has check', function () {
      la(check.fn(check.arrayOfStrings))
      la(check.fn(check.verify.arrayOfStrings))
    })

    it('check.arrayOfStrings', function () {
      // second argument is checkLowerCase
      la(check.arrayOfStrings(['foo', 'Foo']))
      la(!check.arrayOfStrings(['foo', 'Foo'], true))
      la(check.arrayOfStrings(['foo', 'bar'], true))
      la(!check.arrayOfStrings(['FOO', 'BAR'], true))
    })

    it('checks if strings are lower case', function () {
      la(check.arrayOfStrings(['foo', 'Foo']))
      la(!check.arrayOfStrings(['foo', 'Foo'], true))
      la(check.arrayOfStrings(['foo', 'bar'], true))
      la(!check.arrayOfStrings(['FOO', 'BAR'], true))
    })

    it('passes', function () {
      la(check.arrayOfStrings([]))
      la(check.arrayOfStrings(['foo']))
      la(check.arrayOfStrings(['foo', 'bar']))

      check.verify.arrayOfStrings([])
      check.verify.arrayOfStrings(['foo'])
      check.verify.arrayOfStrings(['foo', 'bar'])
    })

    it('fails', function () {
      la(check.raises(function () {
        check.verify.arrayOfStrings('foo')
      }))

      la(check.raises(function () {
        check.verify.arrayOfStrings([1])
      }))

      la(check.raises(function () {
        check.verify.arrayOfStrings(['foo', 1])
      }))
    })

    /** @sample check/arrayOfStrings */
    it('works', function () {
      la(check.arrayOfStrings(['foo', 'BAR']))
      la(!check.arrayOfStrings(['foo', 4]))
      // can check lower case
      la(!check.arrayOfStrings(['foo', 'Bar'], true))
      // lower case flag should be boolean
      la(check.arrayOfStrings(['foo', 'Bar'], 1))
    })
  })

  describe('arrayOfArraysOfStrings', function () {
    it('has check', function () {
      la(check.fn(check.arrayOfArraysOfStrings))
      la(check.fn(check.verify.arrayOfArraysOfStrings))
    })

    it('check.arrayOfArraysOfStrings', function () {
      // second argument is checkLowerCase
      la(check.arrayOfArraysOfStrings([['foo'], ['bar']]))
      la(check.arrayOfArraysOfStrings([['foo'], ['bar']], true))
      la(!check.arrayOfArraysOfStrings([['foo'], ['BAR']], true))
    })

    /** @sample check/arrayOfArraysOfStrings */
    it('checks if all strings are lower case', function () {
      la(check.arrayOfArraysOfStrings([['foo'], ['bar']]))
      la(check.arrayOfArraysOfStrings([['foo'], ['bar']], true))
      la(!check.arrayOfArraysOfStrings([['foo'], ['BAR']], true))
    })

    it('returns true', function () {
      la(check.arrayOfArraysOfStrings([[]]))
      la(check.arrayOfArraysOfStrings([['foo'], ['bar']]))
    })

    it('returns false', function () {
      la(!check.arrayOfArraysOfStrings([['foo', true]]))
      la(!check.arrayOfArraysOfStrings([['foo'], ['bar'], [1]]))
    })

    it('passes', function () {
      check.verify.arrayOfArraysOfStrings([[]])
      check.verify.arrayOfArraysOfStrings([['foo']])
      check.verify.arrayOfArraysOfStrings([['foo'], ['bar'], []])
    })

    it('fails', function () {
      la(check.raises(function () {
        check.verify.arrayOfArraysOfStrings('foo')
      }))

      la(check.raises(function () {
        check.verify.arrayOfArraysOfStrings([1])
      }))

      la(check.raises(function () {
        check.verify.arrayOfArraysOfStrings(['foo', 1])
      }))

      la(check.raises(function () {
        check.verify.arrayOfArraysOfStrings([['foo', 1]])
      }))
    })
  })
})
