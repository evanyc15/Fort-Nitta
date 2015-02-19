define([
    'app',
    'marionette',
    'handlebars',
    'collections/ForumsCategoryCollection',
    'text!templates/main_forumsMain.html'
], function (App, Marionette, Handlebars, ForumsCategoryCollection, template){

    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),
        collection: new ForumsCategoryCollection(),

        initialize: function(options){
            this.options = options;
        },
        events: {
         "click .forumsMainRow": "forumThreadShow",
        },
        forumThreadShow: function(event){
            var id = $(event.target).closest(".forumsMainRow").attr("id");

            this.trigger("click:thread:show", {model: this.collection.findWhere({'category_name': id.toLowerCase()})});
        }
        
    });
});