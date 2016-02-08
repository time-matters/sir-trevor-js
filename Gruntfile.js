/*global module:false*/
module.exports = function(grunt) {

  var banner = ['/*!',
                 ' * Sir Trevor JS v<%= pkg.version %>',
                 ' *',
                 ' * Released under the MIT license',
                 ' * www.opensource.org/licenses/MIT',
                 ' *',
                 ' * <%= grunt.template.today("yyyy-mm-dd") %>',
                 ' */\n\n'
                ].join("\n");

  grunt.loadNpmTasks('grunt-rigger');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-postcss');

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    'jasmine' : {
      'sir-trevor': {
        src : 'sir-trevor.js',
        options: {
          vendor: ['bower_components/jquery/jquery.js',
                   'bower_components/underscore/underscore.js',
                   'bower_components/Eventable/eventable.js'],
          specs : 'spec/javascripts/**/*.spec.js',
          helpers : 'spec/javascripts/helpers/*.js'
        }
      }
    },

    rig: {
      build: {
        options: {
          banner: banner
        },
        files: {
          'sir-trevor.js': ['src/sir-trevor.js']
        }
      }
    },

    uglify: {
      options: {
        mangle: false,
        banner: banner
      },
      standard: {
        files: {
          'sir-trevor.min.js': ['sir-trevor.js']
        }
      }
    },

    watch: {
      scripts: {
        files: ['src/*.js', 'src/**/*.js', 'src/sass/*.scss'],
        tasks: ['sass', 'rig']
      }
    },

    jshint: {
      all: ['sir-trevor.js'],

      options: {
        curly: true,
        eqeqeq: true,
        immed: false,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true,
        _: true,
        console: true
      }
    },

    sass: {
      dist: {
        files: {
          'sir-trevor.css': 'src/sass/main.scss'
        }
      }
    },

    postcss: {
      options: {
        map: {
          inline: false, // save all sourcemaps as separate files...
          annotation: './' // ...to the specified directory
        },

        processors: [
          require('pixrem')(), // add fallbacks for rem units
          require('autoprefixer')({browsers: ['last 2 versions', 'Firefox ESR', '> 2%', 'Explorer >= 9', 'Android >= 4.0']}), // add vendor prefixes
          require('cssnano')() // minify the result
        ]
      },
      dist: {
        src: 'sir-trevor.css'
      }
    }

  });

  // Default task.
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.registerTask('travis', ['rig', 'jasmine']);

  grunt.registerTask('default', ['postcss', 'rig', 'uglify', 'jasmine']);

  grunt.registerTask('build', ['postcss', 'rig', 'uglify']);

  grunt.registerTask('jasmine-browser', ['server','watch']);

};
