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
        "backbone.validation":"../libs/plugins/backbone-validation",
        "cookie":"../libs/jquery.cookie",
        "foundation":"../libs/foundation/foundation.min",
        "foundation-topbar":"../libs/foundation/foundation/foundation.topbar",
        "foundation-reveal":"../libs/foundation/foundation/foundation.reveal",
        "modernizr":"../libs/foundation/vendor/modernizr",
        "text":"../libs/plugins/text",
        "datatables":"../libs/plugins/jquery.dataTables/js/jquery.dataTables.min",
        "foundation-datatables":"../libs/plugins/jquery.dataTables/foundation/dataTables.foundation.min",
        "moment":"../libs/plugins/moment",
        "slick":"../libs/plugins/slick/slick.min",
        "jquery-mousewheel":"../libs/plugins/jquery.mousewheel-3.0.6.pack",
        "fancybox":"../libs/plugins/fancybox/jquery.fancybox.pack",
        "fancybox-buttons":"../libs/plugins/fancybox/helpers/jquery.fancybox-buttons",
        "fancybox-media":"../libs/plugins/fancybox/helpers/jquery.fancybox-media",
        "fancybox-thumbs":"../libs/plugins/fancybox/helpers/jquery.fancybox-thumbs",
        "dropzone":"../libs/plugins/dropzone/dropzone",
        "skrollr":"../libs/plugins/skrollr.min"
    },
    // Sets the configuration for your third party scripts that are not AMD compatible
    shim:{
        "jqueryui":["jquery"],
        "backbone":{
            "deps":["underscore"],
            // Exports the global window.Backbone object
            "exports":"Backbone"
        },
        "backbone.validation":["backbone"],
        "cookie":["jquery"],
        "foundation":["jquery"],
        "foundation-topbar":["foundation"],
        "foundation-reveal":["foundation"],
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
        "backbone.validateAll":["backbone"],
        "slick":["jquery"],
        "jquery-mousewheel":["jquery"],
        "fancybox":["jquery"],
        "fancybox-buttons":["jquery","fancybox"],
        "fancybox-media":["jquery","fancybox"],
        "fancybox-thumbs":["jquery","fancybox"]
    }
});

// Includes Desktop Specific JavaScript files here (or inside of your Desktop router)
require(["app", "routers/AppRouter", "controllers/Controller", "marionette", "jqueryui", "foundation", "modernizr"],
    function (App, AppRouter, Controller) {
        App.appRouter = new AppRouter({
            controller:new Controller()
        });

        App.start();
    });