module.exports = function (config) {
  config.set({
    base: '.',
    frameworks: ['mocha'],
    files: [
      '../dist/check-more-types.js',
      '../node_modules/lazy-ass/index.js',
      'unit-tests.js'
    ],
    port: 9876,
    browsers: ['PhantomJS'],
    singleRun: true
  })
}
