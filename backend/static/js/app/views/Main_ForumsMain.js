define([
    'app',
    'marionette',
    'handlebars',
    'text!templates/main_forumsMain.html'
], function (App, Marionette, Handlebars, template){

    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),

        initialize: function(options){
            this.options = options;
        },
        events: {
         "click .forumsMainRow": "forumThreadShow",
        },
        forumThreadShow: function(event){
            var id = $(event.target).closest(".forumsMainRow").attr("id");

            this.trigger("click:thread:show", {id: id});
        }
        
    });
});