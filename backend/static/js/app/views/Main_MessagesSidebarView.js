define([
    'app',
    'marionette',
    'handlebars',
    'text!templates/main_messagessidebar.html'
], function (App, Marionette, Handlebars, template){

    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),

        initialize: function(options){
            this.options = options;
        },
        events: {
         "click .main_messages-user": "switchMessenger"
        },
        switchMessenger: function(event) {
            this.$(".custom_accordion li").removeClass("active");
            $(event.currentTarget).addClass("active");
        }
        
    });
});