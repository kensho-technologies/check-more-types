module.exports = function(grunt) {
  'use strict';

  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    pkg: pkg,

    sync: {
      all: {
        options: {
          sync: ['author', 'name', 'version',
            'private', 'license', 'keywords', 'homepage'],
        }
      }
    },

    'string-replace': {
      dist: {
        files: {
          'dist/check-more-types.js': 'dist/check-more-types.js'
        },
        options: {
          replacements: [{
            pattern: '{{ packageVersion }}',
            replacement: pkg.version
          }]
        }
      }
    },

    xplain: {
      options: {
        framework: 'jasmine'
      },
      api: {
        options: {
          output: 'docs/use.md',
          framework: 'jasmine'
        },
        src: ['test/unit-tests.js']
      }
    },

    toc: {
      api: {
        options: {
          heading: '* **API**\n'
        },
        files: {
          './docs/use-toc.md': './docs/use.md'
        }
      }
    },

    readme: {
      options: {
        readme: './docs/README.tmpl.md',
        docs: '.',
        templates: './docs'
      }
    },

    mochaTest: {
      unminified: {
        options: {
          reporter: 'spec'
        },
        src: ['test/check-more-types-spec.js']
      },
      minified: {
        options: {
          reporter: 'spec'
        },
        src: ['test/check-more-types-minified-spec.js']
      },
      syntheticBrowser: {
        src: ['test/synthetic-browser-spec.js']
      }
    },

    gt: {
      unminified: {
        options: {
          cover: 'cover',
          bdd: true
        },
        src: ['test/unit-tests.js']
      },
      minified: {
        options: {
          cover: 'min-cover',
          bdd: true
        },
        src: ['test/check-more-types-minified-spec.js']
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %>\n' +
        ' homepage: <%= pkg.homepage %>\n' +
        ' Copyright @ 2014 Kensho license: <%= pkg.license %> */\n\n'
      },
      minified: {
        files: {
          'dist/check-more-types.min.js': ['dist/check-more-types.js']
        }
      }
    },

    watch: {
      options: {
        atBegin: true
      },
      all: {
        files: ['*.js', 'test/*.js', 'package.json'],
        tasks: ['test']
      }
    }
  });

  var plugins = require('matchdep').filterDev('grunt-*');
  plugins.forEach(grunt.loadNpmTasks);

  grunt.registerTask('test', ['gt']);
  grunt.registerTask('doc', ['xplain', 'toc', 'readme']);
  grunt.registerTask('default',
    ['nice-package', 'deps-ok', 'sync', 'string-replace', 'uglify', 'doc']);
};
