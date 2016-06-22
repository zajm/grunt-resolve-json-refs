'use strict';

module.exports = function(grunt) {

  var refPattern = /@:([A-Z0-9]+(?:(?:_|\.)[A-Z0-9]+)*)/g;
  var _ = require("lodash");

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('json_ref_resolver', 'Reads JSON data and resolves crossreferecnes between keys', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      var db = {};

      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      });

      _.each(src, function(filepath) {
        // Read file source.
        var fragment = grunt.file.readJSON(filepath);
        _.merge(db, fragment);
      });


      traverseObject(db);

      // Write the destination file.
      grunt.file.write(f.dest, JSON.stringify(db));

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');

      function traverseObject(obj) {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            var value = obj[key];
            if (typeof(value) === "object") {
              traverseObject(value);
            } else {
              obj[key] = resolveReferences(value);
            }
          }
        }
      }

      function resolveReferences(val) {
        if (typeof(val) === "string" && val.indexOf("@:") > -1) {
          var match;
          var unresolvable = [];
          var resolved = [];

          while ((match = refPattern.exec(val)) && unresolvable.indexOf(match[0]) == -1) {
            if (resolved.indexOf(match[0]) > -1) {
              grunt.warn("Circular dependency detected: " + resolved.join(" -> ") + " -> " + match[0]);
            } else {
              var replacement = getReferencedString(match[1]);
              if (replacement) {
                val = val.replace(match[0], replacement);
                // memorize resolved refs so we can detect circular refs
                resolved.push(match[0])
              } else {
                // Memorize unresolvable refs so we don't try them again
                unresolvable.push(match[0]);
              }
              /* Start from the beginning of the string! If we don't then
               * match will become NULL at the end of the string although
               * there are still references present, which would end the
               * loop prematurely.
               */
              refPattern.lastIndex = 0;
            }
          }
        }

        return val;
      }

      function getReferencedString(refString)  {
        var parts = refString.split(".");
        var obj = db;

        for (var i=0; i<parts.length; i++) {
          if (!(obj = obj[parts[i]])) {
            // undefined, if the key doesn't exist
            grunt.warn("\"" + refString + "\" cannot be resolved!");
            break;
          }
        }

        if (typeof(obj) !== "string") {
          grunt.warn("\"" + refString + "\" does not resolve to a string!");
          return undefined;
        } else {
          return obj;
        }
      }

    });
  });

};
