function validTravis(pluginConfig, config) {
  var env = config.env;
  var options = config.options;
  return env.TRAVIS === 'true' &&
    !env.TRAVIS_TAG &&
    options.branch === env.TRAVIS_BRANCH;
}

function publishFromSpecificNode(options, config, callback) {
  console.log('plugin options', options);

  function fail(message) {
    return callback(new Error(message));
  }

  if (typeof options.node !== 'string') {
    return fail('Missing node version in the config');
  }

  if (process.versions.node !== options.node) {
    return fail('Only allowed to publish from Node ' +
      options.node + ' not from ' + process.versions.node);
  }

  // check Travis environment for now
  // maybe it will be not necessary in the future
  // https://github.com/semantic-release/semantic-release/issues/141
  if (!validTravis(options, config)) {
    return fail('Travis is invalid');
  }

  console.log('ok to publish from Node', options.node);

  callback(null);
}

module.exports = publishFromSpecificNode;
