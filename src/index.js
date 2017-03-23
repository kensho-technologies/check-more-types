'use strict'

/**
  Custom JavaScript assertions and predicates
  Created by Kensho https://github.com/kensho-technologies
  Copyright @ 2014 Kensho https://www.kensho.com/
  License: MIT

  @module check
*/

if (typeof Function.prototype.bind !== 'function') {
  throw new Error('Missing Function.prototype.bind, please load es5-shim first')
}

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
    if (low.string(fn) && low.fn(name)) {
      var tmp = fn
      fn = name
      name = tmp
    }

    if (!low.fn(fn)) {
      throw new Error('expected predicate function for name ' + name)
    }
    if (!low.unemptyString(name)) {
      name = fn.name
    }
    if (!low.unemptyString(name)) {
      throw new Error('predicate function missing name\n' + fn.toString())
    }

    function registerPredicate (obj, name, fn) {
      if (!low.object(obj)) {
        throw new Error('missing object ' + obj)
      }
      if (!low.unemptyString(name)) {
        throw new Error('missing name')
      }
      if (!low.fn(fn)) {
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
  then: low.fn
}

// work around reserved keywords checks
promiseSchema['catch'] = low.fn

var hasPromiseApi = schema.schema.bind(null, promiseSchema)

/**
  Returns true if argument implements promise api (.then, .catch, .finally)
  @method promise
*/
function isPromise (p) {
  return check.object(p) && hasPromiseApi(p)
}

// new predicates to be added to check object. Use object to preserve names
var predicates = {
  array: Array.isArray,
  promise: isPromise
}

function mixCollection (collection) {
  Object.keys(collection).forEach(function (name) {
    check.mixin(collection[name], name)
  })
}

[low, mid, predicates, git, internet, arrays, logic, schema].forEach(mixCollection)

check.VERSION = '{{ include-version }}'

module.exports = check
