// Gruntfile.js
module.exports = function(grunt) {

    require('time-grunt')(grunt);
  
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
        js: {
            files: ['Gruntfile.js', 'server.js', 'app/**/*.js', 'public/**/*.js'],
            options: {
                livereload: true
            }
        },
        html: {
            files: ['public/views/**'],
            options: {
                livereload: true
            }
        }
        },
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    args: [],
                    ignore: ['public/**'],
                    ext: 'js,html',
                    nodeArgs: [],
                    delayTime: 1,
                    env: {
                        PORT: 3000
                    },
                    cwd: __dirname
                }
            }
        },  
        concurrent: {
            serve: ['nodemon', 'watch'],
            debug: ['node-inspector', 'shell:debug', 'open:debug'],
            options: {
                logConcurrentOutput: true
            }
        },
        env : {
            options : {},
            // environment variables - see https://github.com/jsoverson/grunt-env for more information
            local: {}
        },    
        'node-inspector': {
            dev: {}
        },
        shell: {
            debug: {
                options: {
                    stdout: true
                },
                command: 'env NODE_PATH=. node --debug-brk application.js'
            }
        },
        open: {
            debug: {
                path: 'http://127.0.0.1:8080/debug?port=5858',
                app: 'Google Chrome'
            }
        }

    });

    // Load NPM tasks
    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

    // Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    grunt.registerTask('serve', ['concurrent:serve']);
    grunt.registerTask('debug', ['concurrent:debug']);
    grunt.registerTask('default', ['serve']);

};