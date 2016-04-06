'use strict'

/* global describe, it */
describe('check-more-types git predicates', function () {
  var la = require('lazy-ass')
  var check = require('..')

  it('is an object', function () {
    var git = require('./git')
    la(check.object(git))
  })

  describe('check.semver', function () {
    it('is a function', function () {
      la(check.fn(check.semver))
    })

    it('allows numbers', function () {
      la(check.semver('1.2.3'))
      la(check.semver('0.2.0'))
    })

    it('does not allow anything else', function () {
      la(!check.semver('1.0'))
      la(!check.semver('1.0.0-alpha'))
    })
  })

  describe('check/shortCommitId', function () {
    /** @sample check/shortCommitId */
    it('shortCommitId', function () {
      la(check.shortCommitId('3b81980'))
    })
  })

  describe('check/commitId', function () {
    /** @sample check/commitId */
    it('commitId', function () {
      la(check.commitId('3b819803cdf2225ca1338beb17e0c506fdeedefc'))
    })
  })

  describe('check.git', function () {
    /** @sample check/git */
    it('detects git url', function () {
      la(check.git('git@github.com:kensho/check-more-types.git'))
    })
  })
})
