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
    'models/ForumsCategoryModel',
    'text!templates/main_forumslayout.html'
],  function (App, $, Backbone, Marionette, _, Handlebars, ForumsMainView, ForumsThreadView, ForumsPostView, ForumsThreadCreateView, ForumsPostsCreateView, ForumsCategoryModel, template) {

    "use strict";

    return Backbone.Marionette.LayoutView.extend({

        template: Handlebars.compile(template),

        initialize: function(options){
            var self = this;

            this.forumsMainView = new ForumsMainView();
            this.forumsThreadView = new ForumsThreadView();
            this.forumsPostsView = new ForumsPostView();
            this.forumsThreadCreateView = new ForumsThreadCreateView();
            this.forumsPostsCreateView = new ForumsPostsCreateView();

            this.forumsMainView.on("click:thread:show", function(data){
                self.forumsThreadView.options = {model: data.model};
                self.contentRegion.show(self.forumsThreadView);
                Backbone.history.navigate('main/forums/'+data.model.get('category_name'));
            });
            this.forumsThreadView.on("click:posts:show", this.threadstoPostsTriggers.bind(this));
            this.forumsThreadView.on("click:newthread:show", this.threadstoCreateThreadTriggers.bind(this));
            this.forumsPostsView.on("click:newpost:show", this.poststoCreatePostsTriggers.bind(this)); 
            this.forumsThreadCreateView.on("click:returnThreads:show", this.createThreadtoThreadsTriggers.bind(this));
            this.forumsPostsCreateView.on("click:returnPosts:show", this.createPoststoPostsTriggers.bind(this));
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
                this.forumsThreadView.options = {model: new ForumsCategoryModel({'category_name': action}), id: this.options.id};
                this.contentRegion.show(this.forumsThreadView);
            } else {
                this.contentRegion.show(this.forumsMainView);
            } 
        },
        threadstoCreateThreadTriggers: function(data){

            this.forumsThreadCreateView.options = {model: data.model};
            this.contentRegion.show(this.forumsThreadCreateView);

            /* When Create Thread view is shown, the Thread view has been destroyed
             * Thus, we re-instantiate Thread view and rebind its callbacks
             */
            this.forumsThreadView = new ForumsThreadView();
            this.forumsThreadView.on("click:posts:show", this.threadstoPostsTriggers.bind(this));
            this.forumsThreadView.on("click:newthread:show", this.threadstoCreateThreadTriggers.bind(this));
        },
        createThreadtoThreadsTriggers: function(data){

            this.forumsThreadView.options = {model: data.model};
            this.contentRegion.show(this.forumsThreadView);

            /* When Thread view is shown, the Create Thread view has been destroyed
             * Thus, we re-instantiate Create Thread view and rebind its callbacks
             */
            this.forumsThreadCreateView = new ForumsThreadCreateView();
            this.forumsThreadCreateView.on("click:returnThreads:show", this.createThreadtoThreadsTriggers.bind(this));
        },
        threadstoPostsTriggers: function(data){

            this.forumsPostsView.options = {model: data.model};
            this.contentRegion.show(this.forumsPostsView);
            if(!data.redirect){
                Backbone.history.navigate(Backbone.history.fragment+"?id="+data.model.get('id')); 
            }

            /* When Posts view is shown, the Thread view has been destroyed
             * Thus, we re-instantiate Thread view and rebind its callbacks
             */
            this.forumsThreadView = new ForumsThreadView();
            this.forumsThreadView.on("click:posts:show", this.threadstoPostsTriggers.bind(this));
            this.forumsThreadView.on("click:newthread:show", this.threadstoCreateThreadTriggers.bind(this));
        },
        poststoCreatePostsTriggers: function(data){

            this.forumsPostsCreateView.options = {model: data.model};
            this.contentRegion.show(this.forumsPostsCreateView);

            /* When Create Posts view is shown, the Posts view has been destroyed
             * Thus, we re-instantiate Create Posts view and rebind its callbacks
             */
             this.forumsPostsView = new ForumsPostView();
             this.forumsPostsView.on("click:newpost:show", this.poststoCreatePostsTriggers.bind(this));
        },
        createPoststoPostsTriggers: function(data){

            this.forumsPostsView.options = {model: data.model};
            this.contentRegion.show(this.forumsPostsView);

            /* When Posts view is shown, the Create Posts view has been destroyed
             * Thus, we re-instantiate Posts view and rebind its callbacks
             */
            this.forumsPostsCreateView = new ForumsPostsCreateView();
            this.forumsPostsCreateView.on("click:returnPosts:show", this.createPoststoPostsTriggers.bind(this));
        }

    });
});
