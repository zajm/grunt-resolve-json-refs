# grunt-json-ref-resolver

This plugin can be used resolve textual references within a self contained JSON hash, meaning:
You can reference one key from the other and have to repeat yourself less. Or More. It depends.
You will be able to repeatedly reference the same content which can then exist in one place only.
We think that's a good thing.

## Getting Started
This plugin requires Grunt `~0.4.5` or `^1.0.0`.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-json-ref-resolver --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-json-ref-resolver');
```

## The "resolve-json-refs" task

### Overview
Currently there is no plugin-specific configuration

### What it does

As stated above, it resolves reference. A reference can look like ```@:THIS_IS_A_REF``` or ```@:THIS_2_IS_A_REF``` or ```@:SO.IS_THIS```.
A reference is identified by the ```@:``` prefix and must consist of uppercase charcters A to Z, digits 0-9, underscores
and dots only. The dot is special in the sense that it delimits sub key names, so you can reference nested values. No
two underscores or dots can be adjacent, and a reference cannot start with either.
To sum things up: A Reference is whatever matches ```/@:([A-Z0-9]+(?:(?:_|\.)[A-Z0-9]+)*)/```.

This plugin will output warnings when

* A reference cannot be resolved
* A reference doesn't resolve to a string
* A circular reference (A -> [...] -> A) is detected

### Usage Examples

Please check out the units tests for details, but this is the gist:

```json
{
    "A": {
        "A1": "A1",
        "A2": "A2"
    },
    "B": {
        "B1": "@:E"
    },
    "C": "@:A.A1",
    "D": "@:C",
    "E": "ahoi!",
    "F": "D",
    "CAREFUL_NOW": "@:@:F",
    "MULTIPLE": "This finally works: Including \"@:A.A1\" and \"@:E\" in the middle of a string!"
}
```

will be turned into

```json
{
    "A": {
        "A1": "A1",
        "A2": "A2"
    },
    "B": {
        "B1": "ahoi!"
    },
    "C": "A1",
    "D": "A1",
    "E": "ahoi!",
    "F": "D",
    "CAREFUL_NOW": "A1",
    "MULTIPLE": "This finally works: Including \"A1\" and \"ahoi!\" in the middle of a string!"
}
```



## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

* 1.0.0
    * update dependencies so that this module does not cause problems with recent grunts

* 0.1.2  
    * bump down required lodash version

* 0.1.1  
    * fixed task name in README.md

* 0.1.0  
    * Initial Release