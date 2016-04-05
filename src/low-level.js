'use strict'

// utility and low level methods
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
