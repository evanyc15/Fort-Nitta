define([
    'App',
    'marionette',
    'handlebars',
    'text!templates/main_settings.html'
], function (App, Marionette, Handlebars, template){
    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),

        initialize: function(options){
            this.options = options;
        },
        events: {
           
        }
    });
});