'use strict'

var low = require('./low-level')
var logic = require('./logic')

/**
Returns true if the argument is an array with at least one value
@method unemptyArray
*/
function unemptyArray (a) {
  return low.isArray(a) && a.length > 0
}

/**
Returns true if each item in the array passes the predicate
@method arrayOf
@param rule Predicate function
@param a Array to check
*/
function arrayOf (rule, a) {
  return low.isArray(a) && a.every(rule)
}

/**
Returns items from array that do not passes the predicate
@method badItems
@param rule Predicate function
@param a Array with items
*/
function badItems (rule, a) {
  if (!low.isArray(a)) {
    throw new Error('expected array to find bad items')
  }
  return a.filter(logic.notModifier(rule))
}

/**
Returns true if given array only has strings
@method arrayOfStrings
@param a Array to check
@param checkLowerCase Checks if all strings are lowercase
*/
function arrayOfStrings (a, checkLowerCase) {
  var v = low.isArray(a) && a.every(low.isString)
  if (v && low.bool(checkLowerCase) && checkLowerCase) {
    return a.every(low.lowerCase)
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
  return low.isArray(a) && a.every(function (arr) {
    return arrayOfStrings(arr, checkLowerCase)
  })
}

module.exports = {
  unemptyArray: unemptyArray,
  arrayOf: arrayOf,
  badItems: badItems,
  arrayOfStrings: arrayOfStrings,
  arrayOfArraysOfStrings: arrayOfArraysOfStrings
}
