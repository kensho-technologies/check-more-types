'use strict'

var low = require('./low-level')

/**
  Checks if the given index is valid in an array or string or -1

  @method found
*/
function found (index) {
  return index >= 0
}

function startsWith (prefix, x) {
  return low.isString(prefix) &&
  low.isString(x) &&
  x.indexOf(prefix) === 0
}

/**
  Checks if the given item is the given {arrya, string}

  @method contains
*/
function contains (where, what) {
  if (Array.isArray(where)) {
    return where.indexOf(what) !== -1
  }
  if (typeof where === 'string') {
    if (typeof what !== 'string') {
      throw new Error('Contains in string should search for string also ' + what)
    }
    return where.indexOf(what) !== -1
  }
  return false
}

/**
  Checks if the type of second argument matches the name in the first

  @method type
*/
function type (expectedType, x) {
  return typeof x === expectedType
}

/**
  Returns true if the index is valid for give string / array

  @method index
*/
function index (list, k) {
  return low.defined(list) &&
  low.has(list, 'length') &&
  k >= 0 &&
  k < list.length
}

/**
  Returns true if both objects are the same type and have same length property

  @method sameLength
*/
function sameLength (a, b) {
  return typeof a === typeof b &&
  a && b &&
  a.length === b.length
}

/**
  Returns true if all items in an array are the same reference

  @method allSame
*/
function allSame (arr) {
  if (!Array.isArray(arr)) {
    return false
  }
  if (!arr.length) {
    return true
  }
  var first = arr[0]
  return arr.every(function (item) {
    return item === first
  })
}

/**
  Returns true if given item is in the array

  @method oneOf
*/
function oneOf (arr, x) {
  if (!Array.isArray(arr)) {
    throw new Error('expected an array')
  }
  return arr.indexOf(x) !== -1
}

module.exports = {
  found: found,
  startsWith: startsWith,
  contains: contains,
  type: type,
  index: index,
  oneOf: oneOf,
  sameLength: sameLength,
  allSame: allSame
}
