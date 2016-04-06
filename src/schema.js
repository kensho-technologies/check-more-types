'use strict'

var curry2 = require('./utils').curry2
var low = require('./low-level')
var verify = require('./verify')
var every = require('./logic').every
var map = require('./logic').map

/**
  Checks if object passes all rules in predicates.

  check.all({ foo: 'foo' }, { foo: check.string }, 'wrong object')

  This is a composition of check.every(check.map ...) calls
  https://github.com/philbooth/check-types.js#batch-operations

  @method all
  @param {object} object object to check
  @param {object} predicates rules to check. Usually one per property.
  @public
  @returns true or false
*/
function all (obj, predicates) {
  // verify.fn(low.isFn(check.every, 'missing check.every method')
  // check.verify.fn(check.map, 'missing check.map method')

  verify(low.isObject(obj), 'missing object to check')
  verify(low.isObject(predicates), 'missing predicates object')

  Object.keys(predicates).forEach(function (property) {
    if (!low.isFn(predicates[property])) {
      throw new Error('not a predicate function for ' + property + ' but ' + predicates[property])
    }
  })
  return every(map(obj, predicates))
}

/**
  Checks given object against predicates object
  @method schema
*/
function schema (predicates, obj) {
  return all(obj, predicates)
}

module.exports = {
  all: all,
  schema: curry2(schema)
}
