define([
    'app',
    'marionette',
    'handlebars',
    'collections/ForumsCategoryCollection',
    'text!templates/main_forumsMain.html',
    'imagesloaded'
], function (App, Marionette, Handlebars, ForumsCategoryCollection, template){

    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),
        collection: new ForumsCategoryCollection(),

        initialize: function(options){
            this.options = options;
            $("#forumsLoadingOverlay").show();
        },
        events: {
         "click .forumsMainRow": "forumThreadShow",
        },
        onBeforeDestroy: function(){
            // Need to unbind events to prevent memory leaks
            this.unbind();
        },
        onShow: function(){
            $("#forumsContentRegion").imagesLoaded(function(){
                $("#forumsLoadingOverlay").hide();
            });    
        },
        forumThreadShow: function(event){
            var id = $(event.target).closest(".forumsMainRow").attr("id");

            this.trigger("click:thread:show", {model: this.collection.findWhere({'category_name': id.toLowerCase()})});
        }
        
    });
});