module.exports = function (grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        reporter: require('jshint-stylish'),
        // ignores: ['src/old/{,*/}*.js'],
        esnext: true
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/{,*/}*.js']
      },
      src: ['asyncdb.amd.js'],
      all: ['asyncdb.amd.js', 'Gruntfile.js', 'test/spec/asyncdb.amd.js']
    },

    uglify: {
      options: {
        banner: '/*! AsyncDB v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      asyncdb: {
        src: 'asyncdb.js',
        dest: 'asyncdb.min.js'
      }
    },

    fix: {
      asyncdb: {}
    }
  });

  grunt.registerMultiTask('fix', require('./build/asyncdb')(grunt));

  grunt.registerTask('build', [
    'jshint:src',
    'fix'
  ]);

  grunt.registerTask('default', [
    'jshint:all'
  ]);
};