module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        requirejs: {
            mainJS: {
                options: {
                    baseUrl: "backend/static/js/app",
                    paths: {
                        "app": "config/Init"
                    },
                    wrap: true,
                    name: "../libs/almond",
                    preserveLicenseComments: false,
                    optimize: "uglify",
                    mainConfigFile: "backend/static/js/app/config/Init.js",
                    include: ["app"],
                    out: "backend/static/js/app/config/Init.min.js"
                }
            },
            mainCSS: {
                options: {
                    optimizeCss: "standard",
                    cssIn: "./backend/static/css/app.css",
                    out: "./backend/static/css/app.min.css"
                }
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'backend/static/js/app/**/*.js', '!backend/static/js/app/**/*min.js'],
            options: {
                globals: {
                    jQuery: true,
                    console: false,
                    module: true,
                    document: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('build', ['requirejs:mainJS', 'requirejs:mainCSS']);
    grunt.registerTask('default', ['test', 'build']);

};