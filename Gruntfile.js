module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    jshint: {
      all: [
        'check-more-types.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    sync: {
      all: {
        options: {
          sync: ['author', 'name', 'version',
            'private', 'license', 'keywords', 'homepage'],
        }
      }
    },

    xplain: {
      options: {
        framework: 'jasmine'
      },
      api: {
        options: {
          output: 'docs/use.md'
        },
        src: ['test/*-spec.js']
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
      }
    },

    uglify: {
      lib: {
        files: {
          'check-more-types.min.js': ['check-more-types.js']
        }
      }
    },

    watch: {
      options: {
        atBegin: true
      },
      all: {
        files: ['*.js', 'test/*.js', 'package.json'],
        tasks: ['jshint', 'test']
      }
    }
  });

  var plugins = require('matchdep').filterDev('grunt-*');
  plugins.forEach(grunt.loadNpmTasks);

  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('doc', ['xplain', 'readme']);
  grunt.registerTask('default',
    ['nice-package', 'deps-ok', 'sync', 'jshint', 'test', 'uglify', 'doc']);
};
