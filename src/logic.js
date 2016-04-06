'use strict'

const low = require('./low-level')

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

module.exports = {
  or: or,
  and: and,
  notModifier: notModifier
}
