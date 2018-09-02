/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, indent:2, node:true, jquery:true */

module.exports = function (grunt) {
    "use strict";
    require('jit-grunt')(grunt);

    // Project configuration.
    grunt.initConfig({
        // JsHint Task
        jshint: {
            all: [
                'src/js/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }

        },
        // JS uglify
        uglify: {
            options: {
                beautify: true,
                compress: false,
                mangle: false
            },
            my_target: {
                files: {
                    "export/js/bottom.min.js": [
                        'node_modules/jquery/dist/jquery.js',
                        'node_modules/popper.js/dist/umd/popper.js',
                        'node_modules/bootstrap/dist/js/bootstrap.js',
                        'src/js/jquery.csInit.js',
                        'src/js/csMain.js',
                        'src/js/csInit.js'
                    ]
                }
            }

        },
        // copy fonts
        // copy css libs
        // copy js libs
        // copy demo-ressources
        copy: {
            main: {
                files: [
                    // includes files within path
                    {expand: true, src: ['src/fonts/*','node_modules/bootstrap/dist/fonts/*','node_modules/font-awesome/fonts/*'], dest: 'export/fonts', filter: 'isFile', flatten: true},
                    {expand: true, src: ['src/less/*.css'], dest: 'export/css', filter: 'isFile', flatten: true},
                    {expand: true, src: ['node_modules/bootstrap/dist/css/bootstrap.css'], dest: 'export/css', filter: 'isFile', flatten: true},
                    {expand: true, src: ['src/js/*'], dest: 'export/js', filter: 'isFile', flatten: true},
                    {expand: true, src: ['src/js/lib/*'], dest: 'export/js/lib', filter: 'isFile', flatten: true},
                    {expand: true, src: ['src/img/*'], dest: 'export/img', filter: 'isFile', flatten: true},
                    {expand: true, src: ['src/.htaccess'], dest: 'export/', filter: 'isFile', flatten: true}
                ]
            },
            cleanexport: {
                files: [
                    {expand: true, src: ['export/*'], dest: 'export', filter: 'isFile', flatten: true}
                ]
            }
        },
        // Less to CSS Task
        less: {
            development: {
                options: {
                    compress: false,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    "export/css/condensed.css": [
                        "node_modules/bootstrap/less/bootstrap.less",
                        "node_modules/font-awesome/less/font-awesome.less",
                        "src/less/main.less"] // destination file and source file
                }
            }
        },
        watch: {
            templates: {
                files: ['src/*.html', 'src/components/*.html', 'src/tpl/*.html'],
                tasks: ['includes', 'copy:cleanexport', 'regex-replace'],
                options: {
                    nospawn: true
                }
            },
            styles: {
                files: ['src/less/*.less'],
                tasks: ['less'],
                options: {
                    nospawn: true
                }
            },
            js: {
                files: ['src/js/**/*.js'],
                tasks: ['jshint'],
                options: {
                    nospawn: true
                }
            }
        },

        // Node unit tests
        nodeunit: {
            tests: []
        },

        // Build the test cases via includes
        includes: {
            options: {
                debug: true // generates html include comments, if true.
            },

            // Generate Templates
            files: {
                src: ['src/*.html'], // Source files
                dest: 'export', // Destination directory
                flatten: true,
                cwd: '.',
                options: {
                    silent: true
                }
            }
        },

        'regex-replace': {
            removecs: {
                src: 'exportclean/*',
                actions: [
                    {
                        search: '<\/?cs-[a-zA-Z]+[^>]*>',
                        replace: '',
                        flags: 'g'
                    },
                    {
                        search: ' cs-[-a-z_A-Z]+ *= *"[^"]*"',
                        replace: '',
                        flags: 'g'
                    },
                    {
                        search: ' cs-[-a-z_A-Z]+',
                        replace: '',
                        flags: 'g'
                    }
                ]
            }
        },

        // Remove export staging directory
        clean: {
            main: {
                src: ['export', 'exportclean']
            },
            components: {
                src: ['src/components']
            }
        }

    });


    grunt.registerTask('statusMsg', 'Log some stuff.', function () {
        grunt.log.write('export Demo... see export folder...').ok();
    });

    // Load plugins used by this task gruntfile
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-regex-replace');

    

    // Load task plugings
    grunt.loadTasks('tasks');

    // grunt.registerTask('fetch', ['exportDownload:components']);
    // grunt.registerTask('fetch-js', ['exportDownload:js']);
    grunt.registerTask('default', ['clean:main', 'includes', 'jshint', 'uglify', 'less', 'copy', 'regex-replace', 'statusMsg', 'watch']);


};
