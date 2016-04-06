'use strict'

var low = require('./low-level')
var mid = require('./mid-level')

var startsWithHttp = mid.startsWith.bind(null, 'http://')
var startsWithHttps = mid.startsWith.bind(null, 'https://')

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

module.exports = {
  http: http,
  https: https,
  webUrl: webUrl
}
