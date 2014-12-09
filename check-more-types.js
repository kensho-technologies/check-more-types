(function checkMoreTypes(check) {
  'use strict';

  /**
    Custom assertions and predicates for https://github.com/philbooth/check-types.js
    Created by Kensho https://github.com/kensho
    Copyright @ 2014 Kensho https://www.kensho.com/
    License: MIT

    @module check
  */

  if (!check) {
    if (typeof require === 'undefined') {
      throw new Error('Cannot find check-types library, has it been loaded?');
    }
    check = require('check-types');
  }

  /**
    Checks if argument is defined or not

    This method now is part of the check-types.js
    @method defined
  */
  function defined(value) {
    return typeof value !== 'undefined';
  }

  /**
    same as ===

    @method same
  */
  function same(a, b) {
    return a === b;
  }

  /**
    Returns true if the index is valid for give string / array

    @method index
  */
  function index(list, k) {
    return defined(list) &&
      has(list, 'length') &&
      k >= 0 &&
      k < list.length;
  }

  /**
    Returns true if both objects are the same type and have same length property

    @method sameLength
  */
  function sameLength(a, b) {
    return typeof a === typeof b &&
      a && b &&
      a.length === b.length;
  }

  /**
    Returns true if all items in an array are the same reference

    @method allSame
  */
  function allSame(arr) {
    if (!check.array(arr)) {
      return false;
    }
    if (!arr.length) {
      return true;
    }
    var first = arr[0];
    return arr.every(function (item) {
      return item === first;
    });
  }

  /**
    Checks if given value is 0 or 1

    @method bit
  */
  function bit(value) {
    return value === 0 || value === 1;
  }

  /**
    Checks if given value is true of false

    @method bool
  */
  function bool(value) {
    return typeof value === 'boolean';
  }

  /**
    Checks if given object has a property
    @method has
  */
  function has(o, property) {
    return Boolean(o && property &&
      typeof property === 'string' &&
      typeof o[property] !== 'undefined');
  }

  /**
  Checks if given string is already in lower case
  @method lowerCase
  */
  function lowerCase(str) {
    return check.string(str) &&
      str.toLowerCase() === str;
  }

  /**
  Returns true if the argument is an array with at least one value
  @method unemptyArray
  */
  function unemptyArray(a) {
    return check.array(a) && a.length > 0;
  }

  /**
  Returns true if given array only has strings
  @method arrayOfStrings
  @param a Array to check
  @param checkLowerCase Checks if all strings are lowercase
  */
  function arrayOfStrings(a, checkLowerCase) {
    var v = check.array(a) && a.every(check.string);
    if (v && check.bool(checkLowerCase) && checkLowerCase) {
      return a.every(check.lowerCase);
    }
    return v;
  }

  /**
  Returns true if given argument is array of arrays of strings
  @method arrayOfArraysOfStrings
  @param a Array to check
  @param checkLowerCase Checks if all strings are lowercase
  */
  function arrayOfArraysOfStrings(a, checkLowerCase) {
    return check.array(a) && a.every(function (arr) {
      return check.arrayOfStrings(arr, checkLowerCase);
    });
  }

  /**
    Checks if object passes all rules in predicates.

    check.all({ foo: 'foo' }, { foo: check.string }, 'wrong object');

    This is a composition of check.every(check.map ...) calls
    https://github.com/philbooth/check-types.js#batch-operations

    @method all
    @param {object} object object to check
    @param {object} predicates rules to check. Usually one per property.
    @public
    @returns true or false
  */
  function all(obj, predicates) {
    check.verify.object(obj, 'missing object to check');
    check.verify.object(predicates, 'missing predicates object');
    Object.keys(predicates).forEach(function (property) {
      check.verify.fn(predicates[property], 'not a predicate function for ' + property);
    });
    return check.every(check.map(obj, predicates));
  }

  /**
    Checks given object against predicates object
    @method schema
  */
  function schema(predicates, obj) {
    return all(obj, predicates);
  }

  /** Checks if given function raises an error

    @method raises
  */
  function raises(fn, errorValidator) {
    check.verify.fn(fn, 'expected function that raises');
    try {
      fn();
    } catch (err) {
      if (typeof errorValidator === 'undefined') {
        return true;
      }
      if (typeof errorValidator === 'function') {
        return errorValidator(err);
      }
      return false;
    }
    // error has not been raised
    return false;
  }

  /**
    Returns true if given value is ''
    @method emptyString
  */
  function emptyString(a) {
    return a === '';
  }

  /**
    Returns true if given value is [], {} or ''
    @method empty
  */
  function empty(a) {
    var hasLength = typeof a === 'string' ||
      Array.isArray(a);
    if (hasLength) {
      return !a.length;
    }
    if (a instanceof Object) {
      return !Object.keys(a).length;
    }
    return false;
  }

  /**
    Returns true if given value has .length and it is not zero, or has properties
    @method unempty
  */
  function unempty(a) {
    var hasLength = typeof a === 'string' ||
      Array.isArray(a);
    if (hasLength) {
      return a.length;
    }
    if (a instanceof Object) {
      return Object.keys(a).length;
    }
    return true;
  }

  /**
    Returns true if 0 <= value <= 1
    @method unit
  */
  function unit(value) {
    return check.number(value) &&
      value >= 0.0 && value <= 1.0;
  }

  var rgb = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
  /**
    Returns true if value is hex RGB between '#000000' and '#FFFFFF'
    @method hexRgb
  */
  function hexRgb(value) {
    return check.string(value) &&
      rgb.test(value);
  }

  // typical git SHA commit id is 40 digit hex string, like
  // 3b819803cdf2225ca1338beb17e0c506fdeedefc
  var shaReg = /^[0-9a-f]{40}$/;

  /**
    Returns true if the given string is 40 digit SHA commit id
    @method commitId
  */
  function commitId(id) {
    return check.string(id) &&
      id.length === 40 &&
      shaReg.test(id);
  }

  // when using git log --oneline short ids are displayed, first 7 characters
  var shortShaReg = /^[0-9a-f]{7}$/;

  /**
    Returns true if the given string is short 7 character SHA id part
    @method shortCommitId
  */
  function shortCommitId(id) {
    return check.string(id) &&
      id.length === 7 &&
      shortShaReg.test(id);
  }

  //
  // helper methods
  //

  if (!check.defend) {
    var checkPredicates = function checksPredicates(fn, predicates, args) {
      check.verify.fn(fn, 'expected a function');
      check.verify.array(predicates, 'expected list of predicates');
      check.verify.defined(args, 'missing args');

      var k = 0, // iterates over predicates
        j = 0, // iterates over arguments
        n = predicates.length;

      for (k = 0; k < n; k += 1) {
        var predicate = predicates[k];
        if (!check.fn(predicate)) {
          continue;
        }

        if (!predicate.call(null, args[j])) {
          var msg = 'Argument ' + (j + 1) + ': ' + args[j] + ' does not pass predicate';
          if (check.unemptyString(predicates[k + 1])) {
            msg += ': ' + predicates[k + 1];
          }
          throw new Error(msg);
        }

        j += 1;
      }
      return fn.apply(null, args);
    };

    check.defend = function defend(fn) {
      var predicates = Array.prototype.slice.call(arguments, 1);
      return function () {
        return checkPredicates(fn, predicates, arguments);
      };
    };
  }

  if (!check.mixin) {
    /** Adds new predicate to all objects
    @method mixin */
    check.mixin = function mixin(fn, name) {
      check.verify.fn(fn, 'expected predicate function');
      if (!check.unemptyString(name)) {
        name = fn.name;
      }
      check.verify.unemptyString(name, 'predicate function missing name\n' + fn.toString());

      function registerPredicate(obj, name, fn) {
        check.verify.object(obj, 'missing object');
        check.verify.unemptyString(name, 'missing name');
        check.verify.fn(fn, 'missing function');

        if (!obj[name]) {
          obj[name] = fn;
        }
      }

      /**
       * Public modifier `maybe`.
       *
       * Returns `true` if `predicate` is  `null` or `undefined`,
       * otherwise propagates the return value from `predicate`.
       * copied from check-types.js
       */
      function maybeModifier(predicate) {
        return function () {
          if (!check.defined(arguments[0]) || check.nulled(arguments[0])) {
            return true;
          }
          return predicate.apply(null, arguments);
        };
      }

      /**
      * Public modifier `not`.
      *
      * Negates `predicate`.
      * copied from check-types.js
      */
      function notModifier(predicate) {
        return function () {
          return !predicate.apply(null, arguments);
        };
      }

      /**
       * Public modifier `verify`.
       *
       * Throws if `predicate` returns `false`.
       * copied from check-types.js
       */
      function verifyModifier(predicate, defaultMessage) {
        return function () {
          var message;
          if (predicate.apply(null, arguments) === false) {
            message = arguments[arguments.length - 1];
            throw new Error(check.unemptyString(message) ? message : defaultMessage);
          }
        };
      }

      registerPredicate(check, name, fn);
      registerPredicate(check.maybe, name, maybeModifier(fn));
      registerPredicate(check.not, name, notModifier(fn));
      registerPredicate(check.verify, name, verifyModifier(fn, name + ' failed'));
    };
  }

  if (!check.then) {
    /**
      Executes given function only if condition is truthy.
      @method then
    */
    check.then = function then(condition, fn) {
      return function () {
        var ok = typeof condition === 'function' ?
          condition.apply(null, arguments) : condition;
        if (ok) {
          return fn.apply(null, arguments);
        }
      };
    };
  }

  // new predicates to be added to check object. Use object to preserve names
  var predicates = {
    defined: defined,
    same: same,
    allSame: allSame,
    bit: bit,
    bool: bool,
    has: has,
    lowerCase: lowerCase,
    unemptyArray: unemptyArray,
    arrayOfStrings: arrayOfStrings,
    arrayOfArraysOfStrings: arrayOfArraysOfStrings,
    all: all,
    schema: schema,
    raises: raises,
    empty: empty,
    emptyString: emptyString,
    unempty: unempty,
    unit: unit,
    hexRgb: hexRgb,
    sameLength: sameLength,
    commitId: commitId,
    shortCommitId: shortCommitId,
    index: index
  };

  Object.keys(predicates).forEach(function (name) {
    check.mixin(predicates[name], name);
  });

  if (typeof module === 'object') {
    module.exports = check;
  }
}(typeof window === 'object' ? window.check : global.check));
