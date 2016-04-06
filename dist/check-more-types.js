(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["check"] = factory();
	else
		root["check"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

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

	var curry2 = __webpack_require__(1).curry2
	var low = __webpack_require__(2)
	var mid = __webpack_require__(3)

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

	var check = {
	  maybe: {},
	  verify: {},
	  not: {},
	  every: every,
	  map: map
	}

	/**
	Checks if given string is already in lower case
	@method lowerCase
	*/
	function lowerCase (str) {
	  return check.string(str) &&
	  str.toLowerCase() === str
	}

	/**
	Returns true if the argument is an array with at least one value
	@method unemptyArray
	*/
	function unemptyArray (a) {
	  return check.array(a) && a.length > 0
	}

	/**
	Returns true if each item in the array passes the predicate
	@method arrayOf
	@param rule Predicate function
	@param a Array to check
	*/
	function arrayOf (rule, a) {
	  return check.array(a) && a.every(rule)
	}

	/**
	Returns items from array that do not passes the predicate
	@method badItems
	@param rule Predicate function
	@param a Array with items
	*/
	function badItems (rule, a) {
	  check.verify.array(a, 'expected array to find bad items')
	  return a.filter(notModifier(rule))
	}

	/**
	Returns true if given array only has strings
	@method arrayOfStrings
	@param a Array to check
	@param checkLowerCase Checks if all strings are lowercase
	*/
	function arrayOfStrings (a, checkLowerCase) {
	  var v = check.array(a) && a.every(check.string)
	  if (v && check.bool(checkLowerCase) && checkLowerCase) {
	    return a.every(check.lowerCase)
	  }
	  return v
	}

	/**
	Returns true if given argument is array of arrays of strings
	@method arrayOfArraysOfStrings
	@param a Array to check
	@param checkLowerCase Checks if all strings are lowercase
	*/
	function arrayOfArraysOfStrings (a, checkLowerCase) {
	  return check.array(a) && a.every(function (arr) {
	    return check.arrayOfStrings(arr, checkLowerCase)
	  })
	}

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
	  check.verify.fn(check.every, 'missing check.every method')
	  check.verify.fn(check.map, 'missing check.map method')

	  check.verify.object(obj, 'missing object to check')
	  check.verify.object(predicates, 'missing predicates object')
	  Object.keys(predicates).forEach(function (property) {
	    if (!check.fn(predicates[property])) {
	      throw new Error('not a predicate function for ' + property + ' but ' + predicates[property])
	    }
	  })
	  return check.every(check.map(obj, predicates))
	}

	/**
	  Checks given object against predicates object
	  @method schema
	*/
	function schema (predicates, obj) {
	  return all(obj, predicates)
	}

	/** Checks if given function raises an error

	  @method raises
	*/
	function raises (fn, errorValidator) {
	  check.verify.fn(fn, 'expected function that raises')
	  try {
	    fn()
	  } catch (err) {
	    if (typeof errorValidator === 'undefined') {
	      return true
	    }
	    if (typeof errorValidator === 'function') {
	      return errorValidator(err)
	    }
	    return false
	  }
	  // error has not been raised
	  return false
	}

	/**
	  Returns true if given value is ''
	  @method emptyString
	*/
	function emptyString (a) {
	  return a === ''
	}

	/**
	  Returns true if given value is [], {} or ''
	  @method empty
	*/
	function empty (a) {
	  var hasLength = typeof a === 'string' ||
	  Array.isArray(a)
	  if (hasLength) {
	    return !a.length
	  }
	  if (a instanceof Object) {
	    return !Object.keys(a).length
	  }
	  return false
	}

	/**
	  Returns true if given value has .length and it is not zero, or has properties
	  @method unempty
	*/
	function unempty (a) {
	  var hasLength = typeof a === 'string' ||
	  Array.isArray(a)
	  if (hasLength) {
	    return a.length
	  }
	  if (a instanceof Object) {
	    return Object.keys(a).length
	  }
	  return true
	}

	function isPortNumber (x) {
	  return check.positive(x) && x <= 65535
	}

	function isSystemPortNumber (x) {
	  return check.positive(x) && x <= 1024
	}

	function isUserPortNumber (x) {
	  return isPortNumber(x) && x > 1024
	}

	/**
	  Returns true if 0 <= value <= 1
	  @method unit
	*/
	function unit (value) {
	  return check.number(value) &&
	  value >= 0.0 && value <= 1.0
	}

	var rgb = /^#(?:[0-9a-fA-F]{3}){1,2}$/
	/**
	  Returns true if value is hex RGB between '#000000' and '#FFFFFF'
	  @method hexRgb
	*/
	function hexRgb (value) {
	  return check.string(value) &&
	  rgb.test(value)
	}

	// typical git SHA commit id is 40 digit hex string, like
	// 3b819803cdf2225ca1338beb17e0c506fdeedefc
	var shaReg = /^[0-9a-f]{40}$/

	/**
	  Returns true if the given string is 40 digit SHA commit id
	  @method commitId
	*/
	function commitId (id) {
	  return check.string(id) &&
	  id.length === 40 &&
	  shaReg.test(id)
	}

	// when using git log --oneline short ids are displayed, first 7 characters
	var shortShaReg = /^[0-9a-f]{7}$/

	/**
	  Returns true if the given string is short 7 character SHA id part
	  @method shortCommitId
	*/
	function shortCommitId (id) {
	  return check.string(id) &&
	  id.length === 7 &&
	  shortShaReg.test(id)
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
	        return check.fn(predicate) ? predicate.apply(null, values) : Boolean(predicate)
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
	      return check.fn(predicate) ? predicate.apply(null, values) : Boolean(predicate)
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

	    /**
	     * Public modifier `verify`.
	     *
	     * Throws if `predicate` returns `false`.
	     * copied from check-types.js
	     */
	    function verifyModifier (predicate, defaultMessage) {
	      return function () {
	        var message
	        if (predicate.apply(null, arguments) === false) {
	          message = arguments[arguments.length - 1]
	          throw new Error(low.unemptyString(message) ? message : defaultMessage)
	        }
	      }
	    }

	    registerPredicate(check, name, fn)
	    registerPredicate(check.maybe, name, maybeModifier(fn))
	    registerPredicate(check.not, name, notModifier(fn))
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

	var hasPromiseApi = schema.bind(null, promiseSchema)

	/**
	  Returns true if argument implements promise api (.then, .catch, .finally)
	  @method promise
	*/
	function isPromise (p) {
	  return check.object(p) && hasPromiseApi(p)
	}

	/**
	  Shallow strict comparison
	  @method equal
	*/
	function equal (a, b) {
	  return a === b
	}

	/**
	  Really simple email sanity check
	  @method email
	*/
	function email (s) {
	  return low.isString(s) &&
	  /^.+@.+\..+$/.test(s)
	}

	// TODO just mix in all low and mid level predicates
	// new predicates to be added to check object. Use object to preserve names
	var predicates = {
	  email: email,
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
	  lowerCase: lowerCase,
	  unemptyArray: unemptyArray,
	  arrayOfStrings: arrayOfStrings,
	  arrayOfArraysOfStrings: arrayOfArraysOfStrings,
	  all: all,
	  schema: curry2(schema),
	  raises: raises,
	  empty: empty,
	  found: mid.found,
	  emptyString: emptyString,
	  unempty: unempty,
	  unit: unit,
	  hexRgb: hexRgb,
	  sameLength: mid.sameLength,
	  commitId: commitId,
	  shortCommitId: shortCommitId,
	  index: mid.index,
	  git: mid.git,
	  arrayOf: arrayOf,
	  badItems: badItems,
	  oneOf: curry2(mid.oneOf, true),
	  promise: isPromise,
	  validDate: low.validDate,
	  equal: curry2(equal),
	  or: or,
	  and: and,
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
	  webUrl: mid.webUrl,
	  url: mid.webUrl,
	  semver: mid.semver,
	  type: curry2(mid.type),
	  http: mid.http,
	  https: mid.https,
	  secure: mid.https,
	  error: low.isError,
	  port: isPortNumber,
	  systemPort: isSystemPortNumber,
	  userPort: isUserPortNumber,
	  contains: mid.contains
	}

	Object.keys(predicates).forEach(function (name) {
	  check.mixin(predicates[name], name)
	})

	check.VERSION = '0.0.0'

	module.exports = check


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict'

	// utility methods
	function curry2 (fn, strict2) {
	  return function curried (a) {
	    if (strict2 && arguments.length > 2) {
	      throw new Error('Curry2 function ' + fn.name +
	        ' called with too many arguments ' + arguments.length)
	    }
	    if (arguments.length === 2) {
	      return fn(arguments[0], arguments[1])
	    }
	    return function second (b) {
	      return fn(a, b)
	    }
	  }
	}

	module.exports = {
	  curry2: curry2
	}


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict'

	// low level predicates

	// most of the old methods same as check-types.js
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
	  has: has
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var low = __webpack_require__(2)

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

	/**
	  Checks if it is exact semver

	  @method semver
	*/
	function semver (s) {
	  return low.unemptyString(s) &&
	  /^\d+\.\d+\.\d+$/.test(s)
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

	/**
	  Returns true for urls of the format `git@....git`

	  @method git
	*/
	function git (url) {
	  return low.unemptyString(url) &&
	  /^git@/.test(url)
	}

	module.exports = {
	  found: found,
	  startsWith: startsWith,
	  contains: contains,
	  type: type,
	  http: http,
	  https: https,
	  webUrl: webUrl,
	  index: index,
	  semver: semver,
	  oneOf: oneOf,
	  sameLength: sameLength,
	  allSame: allSame,
	  git: git
	}


/***/ }
/******/ ])
});
;