'use strict';

(function(){
  var grunt = require('grunt');

  exports["resolve-json-refs"] = {
    setUp: function(done) {
      // setup here if necessary
      done();
    },
    one_level: function(test) {
      simpleComparison(test, "one_level", 'Simple one-level replacement');
    },
    two_levels: function(test) {
      simpleComparison(test, "two_levels", 'Two-level replacement (recursion)');
    },
    multiple: function(test) {
      simpleComparison(test, "multiple", 'Multiple replacements within a string');
    },
    variable_names: function(test) {
      simpleComparison(test, "variable_names", 'Variable name format');
    },
    object_ref: function(test) {
      simpleComparison(test, "object_ref", 'References to objects cannot be resolved');
    },
    circular_dependency: function(test) {
      simpleComparison(test, "circular_dependency", 'Circular dependencies are detected');
    },
    nested: function(test) {
      simpleComparison(test, "nested", 'Resolve References to non-top-level keys');
    },
    example: function(test) {
      simpleComparison(test, "example", 'The example from the readme should actually return the advertised result');
    },
    empty_ref: function(test) {
      simpleComparison(test, "empty_ref", 'Empty targets are not interpreted as unresolvable');
    }
  };

  function simpleComparison(test, fileBase, message) {
    test.expect(1);
    var actual = grunt.file.readJSON('tmp/' + fileBase + '.json');
    var expected = grunt.file.readJSON('test/expected/' + fileBase + '.json');
    test.deepEqual(actual, expected, message);
    test.done();
  }

})();