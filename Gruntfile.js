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
                    'index.html': 'index.html'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-bower');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-include-source');
    grunt.registerTask('default', ['clean', 'bower', 'wiredep', 'includeSource']);
};