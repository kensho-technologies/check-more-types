'use strict'

var low = require('./low-level')

// functions that deal with git information

/**
  Checks if it is exact semver

  @method semver
*/
function semver (s) {
  return low.unemptyString(s) &&
  /^\d+\.\d+\.\d+$/.test(s)
}

/**
  Returns true for urls of the format `git@....git`

  @method git
*/
function git (url) {
  return low.unemptyString(url) &&
  /^git@/.test(url)
}

// typical git SHA commit id is 40 digit hex string, like
// 3b819803cdf2225ca1338beb17e0c506fdeedefc
var shaReg = /^[0-9a-f]{40}$/

/**
  Returns true if the given string is 40 digit SHA commit id
  @method commitId
*/
function commitId (id) {
  return low.isString(id) &&
  id.length === 40 &&
  shaReg.test(id)
}

// when using git log --oneline short ids are displayed, first 7 characters
var shortShaReg = /^[0-9a-f]{7}$/

/**
  Returns true if the given string is short 7 character SHA id part
  @method shortCommitId
*/
function shortCommitId (id) {
  return low.isString(id) &&
  id.length === 7 &&
  shortShaReg.test(id)
}

module.exports = {
  semver: semver,
  git: git,
  commitId: commitId,
  shortCommitId: shortCommitId
}
