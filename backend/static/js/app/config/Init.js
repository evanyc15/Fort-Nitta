require.config({
    baseUrl:"./js/app",
    // 3rd party script alias names (Easier to type "jquery" than "libs/jquery, etc")
    // probably a good idea to keep version numbers in the file names for updates checking
    paths:{
        // Core Libraries
        "jquery":"../libs/jquery",
        "jqueryui":"../libs/jqueryui",
        "underscore":"../libs/lodash",
        "backbone":"../libs/backbone",
        "marionette":"../libs/backbone.marionette",
        "handlebars":"../libs/handlebars",

        // Plugins
        "backbone.validateAll":"../libs/plugins/Backbone.validateAll",
        "cookie":"../libs/jquery.cookie",
        "foundation":"../libs/foundation/foundation.min",
        "foundation-topbar":"../libs/foundation/foundation/foundation.topbar",
        "modernizr":"../libs/foundation/vendor/modernizr",
        "text":"../libs/plugins/text",
        "datatables":"../libs/plugins/jquery.dataTables/js/jquery.dataTables.min",
        "foundation-datatables":"../libs/plugins/jquery.dataTables/foundation/dataTables.foundation.min"
    },
    // Sets the configuration for your third party scripts that are not AMD compatible
    shim:{
        "jqueryui":["jquery"],
        "backbone":{
            "deps":["underscore"],
            // Exports the global window.Backbone object
            "exports":"Backbone"
        },
        "cookie":["jquery"],
        "queryparams":["jquery"],
        "foundation":["jquery"],
        "foundation-topbar":["foundation"],
        "foundation-datatables":["datatables"],
        "marionette":{
            "deps":["underscore", "backbone", "jquery"],
            // Exports the global window.Marionette object
            "exports":"Marionette"
        },
        "handlebars":{
            "exports":"Handlebars"
        },
        // Backbone.validateAll plugin (https://github.com/gfranko/Backbone.validateAll)
        "backbone.validateAll":["backbone"]
    }
});

// Includes Desktop Specific JavaScript files here (or inside of your Desktop router)
require(["App", "routers/AppRouter", "controllers/Controller", "jquery", "jqueryui", "foundation", "foundation-topbar", "modernizr", "backbone.validateAll"],
    function (App, AppRouter, Controller) {
        App.appRouter = new AppRouter({
            controller:new Controller()
        });

        App.start();
    });