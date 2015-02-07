define([
    'app',
    'marionette',
    'handlebars',
    'text!templates/main_messagessidebar.html',
    'jqueryui'
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
        },
        onShow: function() {
            var tags = ["bob_doe123","ghostsp15","test123","ghost12","ghost1235","bob_miller234","bryanScott1235"];
            this.$el.find("#main_messages-search-input").autocomplete({
                source: tags
            });
        }
        
    });
});