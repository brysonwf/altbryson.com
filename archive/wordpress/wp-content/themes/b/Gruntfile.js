module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                separator: ';'
            },
            base: {
                src: [
                    'js/**/*.js',
                ],
                dest: 'base.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT") %> */\n'
            },
            dist: {
                files: {
                    'base.min.js': [''+'<%= concat.base.dest %>']
                }
            }
        },
        compass: {
            config: 'config.rb'
        },
        bless: {
            css: {
                options: {
                    'imports':'false'
                },
                files: {
                    'style.css': 'style.css'
                }
            }
        },
        watch: {
            scripts: {
                files: [
                    'js/**/*.js'
                ],
                tasks: ['concat', 'uglify']
            },
            css : {
                files: ['scss/**/*.scss'],
                tasks: ['compass','bless'],
                options: {
                    debounceDelay: 500
                }
            }
        }
    });

    //Load NPM Tasks
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
//    grunt.loadNpmTasks('grunt-sftp-deploy');
    grunt.loadNpmTasks('grunt-bless');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify', 'compass', 'bless']);

    //JS Only
    grunt.registerTask('js', ['concat', 'uglify']);

    //CSS Only
    grunt.registerTask('css', ['compass', 'bless']);

    //Watcher Task
    grunt.registerTask('watcher', ['watch']);

};
