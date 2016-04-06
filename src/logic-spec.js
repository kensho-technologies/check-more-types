'use strict'

/* global describe, it */
describe('check-more-types logic predicates', function () {
  var la = require('lazy-ass')
  var logic = require('./logic')
  var check = require('..')

  it('has a few methods', function () {
    la(check.fn(logic.or), 'has or')
    la(check.fn(logic.and), 'has and')
  })

  describe('check.or', function () {
    it('combines predicate functions', function () {
      var predicate = logic.or(check.bool, check.unemptyString)
      la(check.fn(predicate), 'got new predicate function')
      la(predicate(true), 'boolean')
      la(predicate('foo'), 'unempty string')
      la(!predicate(42), 'not for a number')
    })

    it('allows single function', function () {
      var predicate = logic.or(check.number)
      la(predicate(10))
      la(!predicate(true))
    })

    it('handles non-function values as truthy', function () {
      var predicate = logic.or(check.unemptyString, 42)
      la(predicate(), '42 wins')
      la(predicate('foo'), 'string wins')
    })

    it('works with schema check', function () {
      var isFirstLastNames = check.schema.bind(null, {
        first: check.unemptyString,
        last: check.unemptyString
      })
      var isValidPerson = check.schema.bind(null, {
        name: check.or(check.unemptyString, isFirstLastNames)
      })
      la(isValidPerson({ name: 'foo' }))
      la(isValidPerson({ name: {first: 'foo', last: 'bar'} }))
      la(!isValidPerson({ first: 'foo' }))
    })
  })

  describe('check.and', function () {
    function isFoo (x) { return x === 'foo' }

    it('combines predicate functions', function () {
      var predicate = logic.and(check.unemptyString, isFoo)
      la(check.fn(predicate), 'got new predicate function')
      la(predicate('foo'), 'foo')
      la(!predicate(42), 'not for a number')
    })

    it('allows single function', function () {
      var predicate = logic.and(check.number)
      la(predicate(10))
      la(!predicate(true))
    })

    it('handles non-function values as truthy', function () {
      var predicate = logic.and(check.unemptyString, 42)
      la(!predicate())
      la(predicate('f'))
    })
  })
})
