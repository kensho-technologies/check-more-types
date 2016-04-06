'use strict'

// low level predicates

// most of the old methods from check-types.js
function isFn (x) { return typeof x === 'function' }
function isString (x) { return typeof x === 'string' }
function unemptyString (x) {
  return isString(x) && Boolean(x)
}
function isObject (x) {
  return typeof x === 'object' &&
  !Array.isArray(x) &&
  !isNull(x) &&
  !isDate(x)
}
function isEmptyObject (x) {
  return isObject(x) &&
  Object.keys(x).length === 0
}
function isNumber (x) {
  return typeof x === 'number' &&
  !isNaN(x) &&
  x !== Infinity &&
  x !== -Infinity
}
function isInteger (x) {
  return isNumber(x) && x % 1 === 0
}
function isFloat (x) {
  return isNumber(x) && x % 1 !== 0
}
function isNull (x) { return x === null }
function positiveNumber (x) {
  return isNumber(x) && x > 0
}
function negativeNumber (x) {
  return isNumber(x) && x < 0
}
function isDate (x) {
  return x instanceof Date
}
function isRegExp (x) {
  return x instanceof RegExp
}
function isError (x) {
  return x instanceof Error
}
function instance (x, type) {
  return x instanceof type
}
function hasLength (x, k) {
  if (typeof x === 'number' && typeof k !== 'number') {
    // swap arguments
    return hasLength(k, x)
  }
  return (Array.isArray(x) || isString(x)) && x.length === k
}

module.exports = {
  isFn: isFn,
  isString: isString,
  isObject: isObject,
  isNull: isNull,
  unemptyString: unemptyString,
  isEmptyObject: isEmptyObject,
  isInteger: isInteger,
  isFloat: isFloat,
  positiveNumber: positiveNumber,
  negativeNumber: negativeNumber,
  isRegExp: isRegExp,
  isError: isError,
  instance: instance,
  hasLength: hasLength,
  isNumber: isNumber,
  isDate: isDate
}
