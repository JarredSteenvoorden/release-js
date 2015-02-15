module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        // Clean vendor directory from previous run
        clean: {
            vendor: ['src/vendor'],
            dist: ['.tmp', 'dist']
        },

        // Copy bower dist components to vendor directory
        bower: {
            vendor: {
                dest: 'src/vendor',
                options: {
                    expand: true
                }
            }
        },

        // Copy any files excluded by the above bower command
        copy: {
            vendor: {
                files: [
                    { src: 'bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2', dest: 'src/vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2' },
                    { src: 'bower_components/bootstrap/dist/css/bootstrap.css.map', dest: 'src/vendor/bootstrap/dist/css/bootstrap.css.map' }
                ]
            },

            dist: {
                files: [
                    { src: 'src/index.html', dest: 'dist/index.html' },
                    { expand: true, cwd: 'src/', src: 'assets/**', dest: 'dist/' }
                ]
            }
        },

        // Include bower dependencies in the correct order (change src to vendor directory)
        wiredep: {
            vendor: {
                src: [ 'src/index.html' ],
                options: {
                    exclude: [ 'bootstrap.js' ],

                    // Correct to vendor directory
                    ignorePath: '../bower_components/',
                    fileTypes: {
                        html: {
                            replace: {
                                js: '<script src="vendor/{{filePath}}"></script>',
                                css: '<link href="vendor/{{filePath}}" rel="stylesheet" />'
                            }
                        }
                    }
                }
            }
        },

        // Compile angular templates
        ngtemplates: {
            dev: {
                options: {
                    module: 'app',
                    url: function(value) { return value.substring(value.lastIndexOf('/') + 1); },
                    htmlmin:  {
                        collapseBooleanAttributes:      true,
                        collapseWhitespace:             true,
                        removeAttributeQuotes:          true,
                        removeComments:                 true, // Only if you don't use comment directives!
                        removeEmptyAttributes:          true,
                        removeRedundantAttributes:      true,
                        removeScriptTypeAttributes:     true,
                        removeStyleLinkTypeAttributes:  true
                    }
                },
                src: "src/app/**/*.html",
                dest: "src/app/templates.js"
            }
        },

        // Include app sources
        includeSource: {
            options: {
                basePath: 'src/app',
                baseUrl: 'app/'
            },
            dev: {
                files: {
                    'src/index.html': 'src/index.html'
                }
            }
        },

        // Prepare usemin, used to concat included js files in the correct order
        useminPrepare: {
            html: 'src/index.html',
            options: {
                dest: 'dist'
            }
        },

        usemin: {
            html: ['dist/index.html']
        },

        // Minify concatenated css files
        cssmin: {
            options: {
                keepSpecialComments: 0,
                shorthandCompacting: false,
                roundingPrecision: -1,
                rebase: false
            },
            dist: {
                files: {
                    'dist/app/app.css': '.tmp/concat/app/app.css'
                }
            }
        },

        // Minify concatenated js files
        uglify: {
            dist: {
                options: {
                    mangle: true,
                    enclose: true
                },
                files: {
                    'dist/app/app.js': '.tmp/concat/app/app.js'
                }
            }
        },

        // Correct relative file paths in css files
        replace: {
            dist: {
                options: {
                    patterns: [
                        { match: /..\/fonts/g, replacement: '../assets/fonts' },
                        { match: /..\/..\/..\/assets/g, replacement: '../assets' }
                    ]
                },
                files: [
                    { src: 'dist/app/app.css', dest: 'dist/app/app.css' }
                ]
            }
        },
    });

    grunt.registerTask('heroku-php-dist', 'Creates a heroku php bootloader', function() {
        grunt.file.write('dist/index.php', '<?php include_once("index.html"); ?>');
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-bower');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-include-source');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-replace');

    grunt.registerTask('vendor', ['clean:vendor', 'bower:vendor', 'copy:vendor', 'wiredep:vendor']);
    grunt.registerTask('dev', ['ngtemplates:dev', 'includeSource:dev']);
    grunt.registerTask('dist', ['clean:dist', 'copy:dist', 'useminPrepare', 'concat:generated', 'cssmin:dist', 'uglify:dist', 'usemin', 'replace:dist', 'heroku-php-dist']);

    grunt.registerTask('default', ['vendor', 'dev', 'dist']);
};