'use strict'

/* global describe, it */
describe('check-more-types internet predicates', function () {
  var la = require('lazy-ass')
  var check = require('..')

  it('is an object', function () {
    var internet = require('./internet')
    la(check.object(internet))
  })

  describe('system port', function () {
    it('returns true for system ports', function () {
      la(check.systemPort(80), '80')
      la(check.systemPort(1000), '1000')
    })

    it('returns false for other numbers', function () {
      la(check.not.systemPort(-80), '-80')
      la(!check.systemPort(1337), 'too large')
    })
  })

  describe('user port', function () {
    it('returns false for system ports', function () {
      la(check.not.userPort(80), '80')
      la(!check.userPort(1000), '1000')
      la(!check.userPort(1024), '1024')
    })

    it('returns true for user port numbers', function () {
      la(check.userPort(4500), '4500')
      la(check.userPort(1337), '1337')
    })
  })

  describe('port', function () {
    it('returns true for system and user ports', function () {
      la(check.port(80), '80')
      la(check.port(1337), '1337')
    })

    it('returns false for other numbers', function () {
      la(check.not.port(-80), '-80')
      la(!check.port(70000), 'too large')
    })
  })

  describe('https', function () {
    it('has function and alias', function () {
      la(check.fn(check.https), 'has https')
      la(check.fn(check.secure), 'has secure')
    })

    it('returns true for https urls', function () {
      la(check.https('https://localhost'))
      la(check.secure('https://google.com'))
    })

    it('returns false for non-https urls', function () {
      la(check.not.https('http://localhost'))
      la(!check.secure('http://google.com'))
    })
  })

  it('has webUrl', function () {
    la(check.webUrl('http://localhost:8000/'))
    la(check.webUrl('http://127.0.0.1/'))
    la(check.webUrl('https://www.google.com/'))
    la(!check.webUrl('www.google.com/'))
  })

  it('has url as alias to webUrl', function () {
    la(check.webUrl === check.url)
  })

  describe('check/email', function () {
    it('passes simple emails', function () {
      ['g@kensho.com', 'foo@foo.bar', 'my-email@gmail.com']
        .forEach(function (s) {
          la(check.email(s), s)
        })
    })

    it('fails simple non-emails', function () {
      ['g.kensho.com', 'foo@foo', 'my-email@gmail@com']
        .forEach(function (s) {
          la(!check.email(s), s)
        })
    })
  })
})
