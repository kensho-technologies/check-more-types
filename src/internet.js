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

function isPortNumber (x) {
  return low.positiveNumber(x) && x <= 65535
}

function isSystemPortNumber (x) {
  return low.positiveNumber(x) && x <= 1024
}

function isUserPortNumber (x) {
  return isPortNumber(x) && x > 1024
}

/**
  Really simple email sanity check
  @method email
*/
function email (s) {
  return low.isString(s) &&
  /^.+@.+\..+$/.test(s)
}

module.exports = {
  email: email,
  http: http,
  https: https,
  port: isPortNumber,
  secure: https,
  systemPort: isSystemPortNumber,
  url: webUrl,
  userPort: isUserPortNumber,
  webUrl: webUrl
}
