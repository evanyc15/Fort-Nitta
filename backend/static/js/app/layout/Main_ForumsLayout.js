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
    'views/Main_ForumsThread-Create',
    'views/Main_ForumsPosts-Create',
    'text!templates/main_forumslayout.html'
],  function (App, $, Backbone, Marionette, _, Handlebars, ForumsMainView, ForumsThreadView, ForumsPostView, ForumsThreadCreateView, ForumsPostsCreateView, template) {

    "use strict";

    return Backbone.Marionette.LayoutView.extend({

        template: Handlebars.compile(template),

        initialize: function(options){
            var self = this;

            this.forumsMainView = new ForumsMainView();
            this.forumsThreadView = new ForumsThreadView();
            this.forumsPostView = new ForumsPostView();
            // this.ForumsThreadCreateView = new ForumsThreadCreateView();

            this.forumsMainView.on("click:thread:show", function(data){
                self.forumsThreadView.options = {id: data.id.toLowerCase()};
                self.contentRegion.show(self.forumsThreadView);
                Backbone.history.navigate('main/forums/'+data.id);
            });
            this.forumsThreadView.on("click:posts:show", function(data){
                self.forumsPostView.options = {id: data.id};
                self.contentRegion.show(self.forumsPostView);
            });
            this.forumsThreadView.on("click:newthread:show", function(){
                self.contentRegion.show(new ForumsThreadCreateView());
            });
            this.forumsPostView.on("click:newpost:show", function(){
                self.contentRegion.show(new ForumsPostsCreateView());
            }); 
            // this.
        },
        regions: {
            contentRegion: "#forumsContentRegion"
        },
        events: {

        },
        onRender: function(){
            // var self = this;
            var action = this.options.action;
            var actionArray = ["ccintroductions","ccgeneralnewsdiscussion","ccgeneralhelphowto","platformandroid",
                                "plaformiososx","platformlinux","platformwindows","supportuseraccounts"];

            if(action && action !== "null" && (actionArray.indexOf(action) > -1)){
                this.forumsThreadView.options = {id: action};
                this.contentRegion.show(this.forumsThreadView);
            } else {
                this.contentRegion.show(this.forumsMainView);
            } 
        }
    });
});
