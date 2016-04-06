'use strict'

// low level predicates

// most of the old methods same as check-types.js
function isFn (x) { return typeof x === 'function' }

function isString (x) { return typeof x === 'string' }

function unemptyString (x) {
  return isString(x) && Boolean(x)
}

var isArray = Array.isArray

function isObject (x) {
  return typeof x === 'object' &&
  !isArray(x) &&
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
  return (isArray(x) || isString(x)) && x.length === k
}

/**
  Checks if argument is defined or not

  This method now is part of the check-types.js
  @method defined
*/
function defined (value) {
  return typeof value !== 'undefined'
}

/**
  Checks if argument is a valid Date instance

  @method validDate
*/
function validDate (value) {
  return isDate(value) &&
  isNumber(Number(value))
}

/**
  Returns true if the argument is primitive JavaScript type

  @method primitive
*/
function primitive (value) {
  var type = typeof value
  return type === 'number' ||
  type === 'boolean' ||
  type === 'string' ||
  type === 'symbol'
}

/**
  Returns true if the value is a number 0

  @method zero
*/
function zero (x) {
  return typeof x === 'number' && x === 0
}

/**
  same as ===

  @method same
*/
function same (a, b) {
  return a === b
}

/**
  Checks if given value is 0 or 1

  @method bit
*/
function bit (value) {
  return value === 0 || value === 1
}

/**
  Checks if given value is true of false

  @method bool
*/
function bool (value) {
  return typeof value === 'boolean'
}

/**
Checks if given string is already in lower case
@method lowerCase
*/
function lowerCase (str) {
  return isString(str) &&
  str.toLowerCase() === str
}

/**
  Checks if given object has a property
  @method has
*/
function has (o, property) {
  if (arguments.length !== 2) {
    throw new Error('Expected two arguments to check.has, got only ' + arguments.length)
  }
  return Boolean(o && property &&
    typeof property === 'string' &&
    typeof o[property] !== 'undefined')
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
  isDate: isDate,
  defined: defined,
  validDate: validDate,
  primitive: primitive,
  zero: zero,
  same: same,
  bit: bit,
  bool: bool,
  has: has,
  isArray: isArray,
  lowerCase: lowerCase
}
