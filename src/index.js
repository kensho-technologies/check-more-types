'use strict'

/**
  Custom JavaScript assertions and predicates
  Created by Kensho https://github.com/kensho
  Copyright @ 2014 Kensho https://www.kensho.com/
  License: MIT

  @module check
*/

if (typeof Function.prototype.bind !== 'function') {
  throw new Error('Missing Function.prototype.bind, please load es5-shim first')
}

var curry2 = require('./utils').curry2
var low = require('./low-level')
var mid = require('./mid-level')
var arrays = require('./arrays')
var logic = require('./logic')
var git = require('./git')
var internet = require('./internet')
var schema = require('./schema')

var check = {
  maybe: {},
  verify: {},
  not: {},
  every: logic.every,
  map: logic.map
}

//
// helper methods
//

if (!check.defend) {
  var checkPredicates = function checksPredicates (fn, predicates, args) {
    check.verify.fn(fn, 'expected a function')
    check.verify.array(predicates, 'expected list of predicates')
    check.verify.defined(args, 'missing args')

    var k = 0 // iterates over predicates
    var j = 0 // iterates over arguments
    var n = predicates.length

    for (k = 0; k < n; k += 1) {
      var predicate = predicates[k]
      if (!check.fn(predicate)) {
        continue
      }

      if (!predicate(args[j])) {
        var msg = 'Argument ' + (j + 1) + ': ' + args[j] + ' does not pass predicate'
        if (low.unemptyString(predicates[k + 1])) {
          msg += ': ' + predicates[k + 1]
        }
        throw new Error(msg)
      }

      j += 1
    }
    return fn.apply(null, args)
  }

  check.defend = function defend (fn) {
    var predicates = Array.prototype.slice.call(arguments, 1)
    return function () {
      return checkPredicates(fn, predicates, arguments)
    }
  }
}

if (!check.mixin) {
  /** Adds new predicate to all objects
  @method mixin */
  check.mixin = function mixin (fn, name) {
    if (low.isString(fn) && low.isFn(name)) {
      var tmp = fn
      fn = name
      name = tmp
    }

    if (!low.isFn(fn)) {
      throw new Error('expected predicate function for name ' + name)
    }
    if (!low.unemptyString(name)) {
      name = fn.name
    }
    if (!low.unemptyString(name)) {
      throw new Error('predicate function missing name\n' + fn.toString())
    }

    function registerPredicate (obj, name, fn) {
      if (!low.isObject(obj)) {
        throw new Error('missing object ' + obj)
      }
      if (!low.unemptyString(name)) {
        throw new Error('missing name')
      }
      if (!low.isFn(fn)) {
        throw new Error('missing function')
      }

      if (!obj[name]) {
        obj[name] = fn
      }
    }

    /**
     * Public modifier `maybe`.
     *
     * Returns `true` if `predicate` is  `null` or `undefined`,
     * otherwise propagates the return value from `predicate`.
     * copied from check-types.js
     */
    function maybeModifier (predicate) {
      return function () {
        if (!check.defined(arguments[0]) || check.nulled(arguments[0])) {
          return true
        }
        return predicate.apply(null, arguments)
      }
    }

    var verifyModifier = require('./verify')

    registerPredicate(check, name, fn)
    registerPredicate(check.maybe, name, maybeModifier(fn))
    registerPredicate(check.not, name, logic.notModifier(fn))
    registerPredicate(check.verify, name, verifyModifier(fn, name + ' failed'))
  }
}

if (!check.then) {
  /**
    Executes given function only if condition is truthy.
    @method then
  */
  check.then = function then (condition, fn) {
    return function () {
      var ok = typeof condition === 'function' ? condition.apply(null, arguments) : condition
      if (ok) {
        return fn.apply(null, arguments)
      }
    }
  }
}

var promiseSchema = {
  then: low.isFn
}

// work around reserved keywords checks
promiseSchema['catch'] = low.isFn

var hasPromiseApi = schema.schema.bind(null, promiseSchema)

/**
  Returns true if argument implements promise api (.then, .catch, .finally)
  @method promise
*/
function isPromise (p) {
  return check.object(p) && hasPromiseApi(p)
}

// TODO just mix in all low and mid level predicates
// new predicates to be added to check object. Use object to preserve names
var predicates = {
  nulled: low.isNull,
  fn: low.isFn,
  string: low.isString,
  unemptyString: low.unemptyString,
  object: low.isObject,
  number: low.isNumber,
  array: Array.isArray,
  positiveNumber: low.positiveNumber,
  negativeNumber: low.negativeNumber,
  // a couple of aliases
  positive: low.positiveNumber,
  negative: low.negativeNumber,
  defined: low.defined,
  same: low.same,
  allSame: mid.allSame,
  bit: low.bit,
  bool: low.bool,
  has: low.has,
  lowerCase: low.lowerCase,
  unemptyArray: arrays.unemptyArray,
  arrayOfStrings: arrays.arrayOfStrings,
  arrayOfArraysOfStrings: arrays.arrayOfArraysOfStrings,
  all: schema.all,
  schema: curry2(schema.schema),
  raises: mid.raises,
  empty: low.empty,
  found: mid.found,
  emptyString: low.emptyString,
  unempty: low.unempty,
  unit: mid.unit,
  hexRgb: mid.hexRgb,
  sameLength: mid.sameLength,
  index: mid.index,
  arrayOf: arrays.arrayOf,
  badItems: arrays.badItems,
  oneOf: curry2(mid.oneOf, true),
  promise: isPromise,
  validDate: low.validDate,
  equal: curry2(low.equal),
  or: logic.or,
  and: logic.and,
  primitive: low.primitive,
  zero: low.zero,
  date: low.isDate,
  regexp: low.isRegExp,
  instance: low.instance,
  emptyObject: low.isEmptyObject,
  length: curry2(low.hasLength),
  floatNumber: low.isFloat,
  intNumber: low.isInteger,
  startsWith: mid.startsWith,
  contains: mid.contains,
  error: low.isError,
  type: curry2(mid.type)
}

Object.keys(predicates).forEach(function (name) {
  check.mixin(predicates[name], name)
})

Object.keys(git).forEach(function (name) {
  check.mixin(git[name], name)
})

Object.keys(internet).forEach(function (name) {
  check.mixin(internet[name], name)
})

check.VERSION = '{{ packageVersion }}'

module.exports = check
