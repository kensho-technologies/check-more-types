'use strict'

var low = require('./low-level')

/**
 * Public modifier `verify`.
 *
 * Throws if `predicate` returns `false`.
 * copied from check-types.js
 */
function verify (predicate, defaultMessage) {
  return function () {
    var message
    if (predicate.apply(null, arguments) === false) {
      message = arguments[arguments.length - 1]
      throw new Error(low.unemptyString(message) ? message : defaultMessage)
    }
  }
}

module.exports = verify
