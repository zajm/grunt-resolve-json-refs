'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    "resolve-json-refs": {
      one_level: {
        files: {
          'tmp/one_level.json': ['test/fixtures/one_level.json']
        }
      },
      two_levels: {
        files: {
          'tmp/two_levels.json': ['test/fixtures/two_levels.json']
        }
      },
      multiple: {
        files: {
          'tmp/multiple.json': ['test/fixtures/multiple.json']
        }
      },
      variable_names: {
        files: {
          'tmp/variable_names.json': ['test/fixtures/variable_names.json']
        }
      },
      double_evaluation: {
        files: {
          'tmp/double_evaluation.json': ['test/fixtures/double_evaluation.json']
        }
      },
      object_ref: {
        files: {
          'tmp/object_ref.json': ['test/fixtures/object_ref.json']
        }
      },
      circular_dependency: {
        files: {
          'tmp/circular_dependency.json': ['test/fixtures/circular_dependency.json']
        }
      },
      nested: {
        files: {
          'tmp/nested.json': ['test/fixtures/nested.json']
        }
      },
      example: {
        files: {
          'tmp/example.json': ['test/fixtures/example.json']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'resolve-json-refs', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
