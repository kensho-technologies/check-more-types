'use strict'

/* global describe, it */
describe('check-more-types schema predicates', function () {
  var la = require('lazy-ass')
  var check = require('..')

  it('is an object', function () {
    var schemaPredicates = require('./schema')
    la(check.object(schemaPredicates))
  })

  describe('check.schema', function () {
    la(check.fn(check.schema))

    it('is curried', function () {
      var hasName = check.schema({ name: check.unemptyString })
      la(check.fn(hasName), 'returned a function')
      la(hasName({ name: 'my name' }))
      la(!hasName({ age: 42 }))
    })

    it('check.schema', function () {
      var obj = {
        foo: 'foo',
        bar: 'bar',
        baz: 'baz'
      }
      var schema = {
        foo: check.unemptyString,
        bar: function (value) {
          return value === 'bar'
        }
      }
      la(check.schema(schema, obj))
      la(!check.schema(schema, {}))
    })

    it('check.schema', function () {
      la(typeof check.schema === 'function', 'check.schema function')
    })

    it('checks person schema', function () {
      var personSchema = {
        name: check.unemptyString,
        age: check.positiveNumber
      }
      var person = {
        name: 'joe',
        age: 20
      }
      la(check.schema(personSchema, person))
    })

    it('check.schema bind', function () {
      var personSchema = {
        name: check.unemptyString,
        age: check.positiveNumber
      }
      var isValidPerson = check.schema.bind(null, personSchema)
      var h1 = {
        name: 'joe',
        age: 10
      }
      var h2 = {
        name: 'ann'
      // missing age property
      }
      la(isValidPerson(h1), 'first person is valid', h1)
      la(!isValidPerson(h2), 'second person is invalid', h2)
    })

    describe('nesting schemas', function () {
      var personSchema = {
        name: check.unemptyString,
        age: check.positiveNumber
      }
      var isValidPerson = check.schema.bind(null, personSchema)

      it('schema composition', function () {
        var teamSchema = {
          manager: isValidPerson,
          members: check.unemptyArray
        }
        var team = {
          manager: {
            name: 'jim',
            age: 20
          },
          members: ['joe', 'ann']
        }
        la(check.schema(teamSchema, team))
      })
    })
  })
})
