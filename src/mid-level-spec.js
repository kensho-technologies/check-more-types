'use strict'

/* global describe, it */
describe('check-more-types mid-level predicates', function () {
  const la = require('lazy-ass')
  const mid = require('./mid-level')
  const check = require('..')

  it('is an object', function () {
    la(check.object(mid))
  })

  it('check/even', function () {
    la(mid.even(2), '2 is even')
    la(mid.even(4), '4 is even')
    la(mid.even(0), '0 is even')
    la(!mid.even(1), '1 is not even')
    la(!mid.even(11), '11 is not even')
  })

  it('check/odd', function () {
    la(!mid.odd(2), '2 is not odd')
    la(!mid.odd(4), '4 is not odd')
    la(!mid.odd(0), '0 is not odd')
    la(mid.odd(1), '1 is odd')
    la(mid.odd(11), '11 is odd')
  })
})
