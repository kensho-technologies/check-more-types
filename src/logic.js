'use strict'

var low = require('./low-level')

/**
  Combines multiple predicate functions to produce new OR predicate
  @method or
*/
function or () {
  var predicates = Array.prototype.slice.call(arguments, 0)
  if (!predicates.length) {
    throw new Error('empty list of arguments to or')
  }

  return function orCheck () {
    var values = Array.prototype.slice.call(arguments, 0)
    return predicates.some(function (predicate) {
      try {
        return low.isFn(predicate) ? predicate.apply(null, values) : Boolean(predicate)
      } catch (err) {
        // treat exceptions as false
        return false
      }
    })
  }
}

/**
  Combines multiple predicate functions to produce new AND predicate
  @method or
*/
function and () {
  var predicates = Array.prototype.slice.call(arguments, 0)
  if (!predicates.length) {
    throw new Error('empty list of arguments to or')
  }

  return function orCheck () {
    var values = Array.prototype.slice.call(arguments, 0)
    return predicates.every(function (predicate) {
      return low.isFn(predicate) ? predicate.apply(null, values) : Boolean(predicate)
    })
  }
}

/**
* Public modifier `not`.
*
* Negates `predicate`.
* copied from check-types.js
*/
function notModifier (predicate) {
  return function () {
    return !predicate.apply(null, arguments)
  }
}

function every (predicateResults) {
  var property, value
  for (property in predicateResults) {
    if (predicateResults.hasOwnProperty(property)) {
      value = predicateResults[property]

      if (low.isObject(value) && every(value) === false) {
        return false
      }

      if (value === false) {
        return false
      }
    }
  }
  return true
}

function map (things, predicates) {
  var property
  var result = {}
  var predicate
  for (property in predicates) {
    if (predicates.hasOwnProperty(property)) {
      predicate = predicates[property]

      if (low.isFn(predicate)) {
        result[property] = predicate(things[property])
      } else if (low.isObject(predicate)) {
        result[property] = map(things[property], predicate)
      }
    }
  }

  return result
}

module.exports = {
  or: or,
  and: and,
  notModifier: notModifier,
  every: every,
  map: map
}
