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
    throw new Error('Cannot find check-types library, has it been loaded?');
  }

  // new predicates to be added to check object
  var predicates = [defined, bit, bool, has, lowerCase, unemptyArray,
    arrayOfStrings, arrayOfArraysOfStrings, all, raises];

  /**
  Checks if argument is defined or not

  @method defined
  */
  function defined(value) {
    return typeof value !== 'undefined';
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

  if (!check.verify.arrayOfStrings) {
    check.verify.arrayOfStrings = function (a, msg) {
      check.verify.array(a, msg + '\nexpected an array, got ' +
        JSON.stringify(a, null, 2));
      a.forEach(function (str, k) {
        check.verify.string(str, msg + '\nexpected string at position ' + k + ' got ' +
          JSON.stringify(str, null, 2));
      });
    };
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

  if (!check.verify.arrayOfArraysOfStrings) {
    check.verify.arrayOfArraysOfStrings = function (a, msg) {
      check.verify.array(a, msg + '\nexpected a top level array, got ' +
        JSON.stringify(a, null, 2));

      a.forEach(function (arr, k) {
        check.verify.arrayOfStrings(arr,
          msg + '\nexpected an array of strings at position ' + k + ' got ' +
          JSON.stringify(arr, null, 2));
      });
    };
  }

  /**
    Checks if object passes all rules in predicates.

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

  if (!check.verify.all) {
    /*
      verify.all(object, predicates, message)
      object - object to verify
      predicates - properties to verify, each property should have a check string
      message - requires message to throw if any predicate is false

      verify.all({ foo: 'foo' }, { foo: check.string }, 'wrong object');

      This is a composition of check.every(check.map ...) calls
      https://github.com/philbooth/check-types.js#batch-operations
    */
    check.verify.all = function (obj, predicates, message) {
      check.verify.unemptyString(message, 'missing error string');
      check.verify.object(obj, 'missing object to check');
      check.verify.object(predicates, 'missing predicates object');
      if (!check.every(check.map(obj, predicates))) {
        throw new Error(message);
      }
    };

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

  if (!check.mixin) {
    /** Adds new predicate to all objects
    @method mixin */
    check.mixin = function mixin(fn) {
      check.verify.fn(fn, 'expected predicate function');
      check.verify.unemptyString(fn.name, 'predicate function missing name');

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

      registerPredicate(check, fn.name, fn);
      registerPredicate(check.maybe, fn.name, maybeModifier(fn));
      registerPredicate(check.not, fn.name, notModifier(fn));
    };
  }

  predicates.forEach(check.mixin);

}(typeof window === 'object' ? window.check : global.check));
