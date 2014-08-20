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

  if (!check.defined) {
    /**
    Checks if argument is defined or not

    @method defined
    */
    check.defined = function (value) {
      return typeof value !== 'undefined';
    };

  }

  if (!check.bit) {
    /**
    Checks if given value is 0 or 1

    @method bit
    */
    check.bit = function (value) {
      return value === 0 || value === 1;
    };

  }

  if (!check.bool) {
    /**
    Checks if given value is true of false

    @method bool
    */
    check.bool = function (value) {
      return typeof value === 'boolean';
    };

  }

  if (!check.has) {
    /**
    Checks if given object has a property
    @method has
    */
    check.has = function (o, property) {
      return Boolean(o && property &&
        typeof property === 'string' &&
        typeof o[property] !== 'undefined');
    };

  }

  if (!check.lowerCase) {
    /**
    Checks if given string is already in lower case
    @method lowerCase
    */
    check.lowerCase = function (str) {
      return check.string(str) &&
        str.toLowerCase() === str;
    };

  }

  if(!check.unemptyArray) {
    /**
    Returns true if the argument is an array with at least one value
    @method unemptyArray
    */
    check.unemptyArray = function (a) {
      return check.array(a) && a.length > 0;
    };
  }

  if (!check.arrayOfStrings) {
    /**
    Returns true if given array only has strings
    @method arrayOfStrings
    @param a Array to check
    @param checkLowerCase Checks if all strings are lowercase
    */
    check.arrayOfStrings = function (a, checkLowerCase) {
      var v = check.array(a) && a.every(check.string);
      if (v && check.bool(checkLowerCase) && checkLowerCase) {
        return a.every(check.lowerCase);
      }
      return v;
    };

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

  if (!check.arrayOfArraysOfStrings) {
    /**
    Returns true if given argument is array of arrays of strings
    @method arrayOfArraysOfStrings
    @param a Array to check
    @param checkLowerCase Checks if all strings are lowercase
    */
    check.arrayOfArraysOfStrings = function (a, checkLowerCase) {
      return check.array(a) && a.every(function (arr) {
        return check.arrayOfStrings(arr, checkLowerCase);
      });
    };

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

  if (!check.all) {
    /**
      Checks if object passes all rules in predicates.

      @method all
      @param {object} object object to check
      @param {object} predicates rules to check. Usually one per property.
      @public
      @returns true or false
    */
    check.all = function all(obj, predicates) {
      check.verify.object(obj, 'missing object to check');
      check.verify.object(predicates, 'missing predicates object');
      Object.keys(predicates).forEach(function (property) {
        check.verify.fn(predicates[property], 'not a predicate function for ' + property);
      });
      return check.every(check.map(obj, predicates));
    };

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

  if (!check.raises) {
    /** Checks if given function raises an error

      @method raises
    */
    check.raises = function (fn, errorValidator) {
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
    };

  }

}(typeof window === 'object' ? window.check : global.check));
