define([
    'app',
    'jquery',
    'backbone',
    'marionette',
    'underscore',
    'handlebars',
    'views/Main_ForumsMain',
    'views/Main_ForumsThread',
    'views/Main_ForumsPosts',
    'text!templates/main_forumslayout.html'
],  function (App, $, Backbone, Marionette, _, Handlebars, ForumsMainView, ForumsThread, ForumsPost, template) {

    "use strict";

    return Backbone.Marionette.LayoutView.extend({

        template: Handlebars.compile(template),

        initialize: function(options){
            var self = this;

            this.forumsMainView = new ForumsMainView();
            this.forumsThreadView = new ForumsThread();
            this.forumsPostView = new ForumsPost();

            this.forumsMainView.on("click:thread:show", function(data){
                self.forumsThreadView.options = {id: data.id};
                self.contentRegion.show(self.forumsThreadView);
                // Backbone.history.navigate('main/forums/'+data.id);
            });
            this.forumsThreadView.on("click:posts:show", function(data){
                self.forumsPostView.options = {id: data.id};
                self.contentRegion.show(self.forumsPostView);
            });
            // this.
        },
        regions: {
            contentRegion: "#forumsContentRegion"
        },
        events: {

        },
        onRender: function(){
            var self = this;
            if(this.options.action === "platformsandroid"){

            } else {
                this.contentRegion.show(this.forumsMainView);
            } 
        }
    });
});
