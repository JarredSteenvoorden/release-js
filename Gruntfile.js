module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        // Clean vendor directory from previous run
        clean: ['src/vendor'],

        // Copy bower dist components to vendor directory
        bower: {
            dev: {
                dest: 'src/vendor',
                options: {
                    expand: true
                }
            }
        },

        // Copy any files excluded by the above bower command
        copy: {
            main: {
                files: [
                    { src: 'bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2', dest: 'src/vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2' },
                    { src: 'bower_components/bootstrap/dist/css/bootstrap.css.map', dest: 'src/vendor/bootstrap/dist/css/bootstrap.css.map' }
                ]
            }
        },

        // Include bower dependencies in the correct order (change src to vendor directory)
        wiredep: {
            task: {
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

        // Include app sources
        includeSource: {
            options: {
                basePath: 'src/app',
                baseUrl: 'app/'
            },
            myTarget: {
                files: {
                    'src/index.html': 'src/index.html'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-bower');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-include-source');
    grunt.registerTask('default', ['clean', 'bower', 'copy', 'wiredep', 'includeSource']);
};