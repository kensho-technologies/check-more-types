'use strict'

const low = require('./low-level')

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

var startsWithHttp = startsWith.bind(null, 'http://')
var startsWithHttps = startsWith.bind(null, 'https://')

function http (x) {
  return low.isString(x) && startsWithHttp(x)
}

function https (x) {
  return low.isString(x) && startsWithHttps(x)
}

function webUrl (x) {
  return low.isString(x) &&
  (startsWithHttp(x) || startsWithHttps(x))
}

module.exports = {
  found: found,
  startsWith: startsWith,
  contains: contains,
  type: type,
  http: http,
  https: https,
  webUrl: webUrl
}
