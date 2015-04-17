module.exports = function (grunt) {
  'use strict';

  var requirejs = require('requirejs'),
    pkg = grunt.file.readJSON('package.json'),
    rdefineEnd = /\}\);[^}\w]*$/,
    embedVersionRgx = /@VERSION/g,
    embedDateRgx = /@DATE/g,
    // yyyy-mm-ddThh:mmZ
    formatISODateRgx = /:\d+\.\d+Z$/,
    excluderRgx = /\/\*\s*ExcludeStart\s*\*\/[\w\W]*?\/\*\s*ExcludeEnd\s*\*\//gi;

  return function () {
    var version = pkg.version,
      done = this.async(),
      target = this.target,
      name = target + '.js',
      config;

    function writeTheCompiledFile(compiled) {
      var thisVeryMoment = (new Date()).toISOString()
        .replace(formatISODateRgx, 'Z');

      compiled = compiled
        .replace(embedVersionRgx, version)
        .replace(embedDateRgx, thisVeryMoment);

      grunt.file.write(name, compiled);
    }

    function compileAll(name, path, contents) {
      var amdName;
      [
        [/\s*return\s+[^\}]+(\}\);[^\w\}]*)$/, '$1'],
        [/\s*exports\.\w+\s*=\s*\w+;/g, ''],
        [/define\([^{]*?{/, ''],
        [rdefineEnd, ''],
        [excluderRgx, ''],
        [/\/\/\s*BuildExclude\n\r?[\w\W]*?\n\r?/ig, ''],
        [/define\(\[[^\]]*\]\)[\W\n]+$/, '']
      ].forEach(function (item) {
        contents = contents.replace(item[0], item[1]);
      });

      amdName = grunt.option('amd');
      if (amdName !== null && /^exports\/amd$/.test(name)) {
        // Remove the comma for anonymous defines
        contents = contents
          .replace(/(\s*)"define"(\,\s*)/, amdName ? '$1"' + amdName + '"$2' : '');

      }
      if (contents.charAt(contents.length - 1) === '\n') {
        // contents = contents.substring(1);
        contents = contents.substring(0, contents.length-1);
      }
      return contents;
    }

    config = {
      baseUrl: 'src',
      optimize: 'none',
      findNestedDependencies: true,
      skipModuleInsertion: true,
      skipSemiColonInsertion: true,
      wrap: {
        startFile: 'build/asyncdb.prefix',
        endFile: 'build/asyncdb.suffix'
      },
      paths: {
        'asyncdb.amd': '../asyncdb.amd'
        // 'lodash': '../bower_components/lodash/lodash'
      },
      // rawText: {
      //   definejs: 'define([]);'
      // },
      name: 'asyncdb.amd',
      strict: true,
      onBuildWrite: compileAll,
      out: writeTheCompiledFile,

      include: []
    };

    requirejs.optimize(config, function (response) {
      grunt.verbose.writeln(response);
      grunt.log.ok('File \'' + name + '\' created.');
      done();
    }, done);
  };
};