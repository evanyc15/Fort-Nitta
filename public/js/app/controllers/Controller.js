define([
    'App', 
    'backbone', 
    'marionette', 
    'models/SessionModel',
    'layout/HomeLayout',
    'layout/MainLayout',
    'cookie'
], function (App, Backbone, Marionette, SessionModel, HomeLayout, MainLayout) {
    'use strict';


    return Backbone.Marionette.Controller.extend({
        initialize:function (options) {
            // Create a new session model and scope it to the app global
            // This will be a singleton, which other modules can access

            App.session = new SessionModel({});

            App.session.on("change:logged_out", function(){
                Backbone.history.navigate('home', {trigger: true});
            });
            App.session.on("change:logged_in", function(){
                Backbone.history.navigate('main', {trigger: true});
            });
            // Check the auth status upon initialization,
            // before rendering anything or matching routes
            App.session.checkAuth({
                // Start the backbone routing once we have captured a user's auth status
                complete: function(){
                    // HTML5 pushState for URLs without hashbangs
                    // var hasPushstate = !!(window.history && history.pushState);
                    // if(hasPushstate) 
                    //     Backbone.history.start({ pushState: true, root: '/' });
                    // else 
                    if(!Backbone.History.started) Backbone.history.start();
                },
                success: function(mod, res){
                    if(!Backbone.History.started) Backbone.history.start();
                    Backbone.history.navigate('main', {trigger: true});
                }, 
                error: function(mod, res) {
                    if(!Backbone.History.started) Backbone.history.start();
                    Backbone.history.navigate('home', {trigger: true});
                }
            });
        },
        //gets mapped to in AppRouter's appRoutes
        index:function () {
            // var hasPushState = !!(window.history && history.pushState);
            // if(!hasPushState) 
            //     this.navigate(window.location.pathname.substring(1), {trigger: true, replace: true});
            // else 
                App.mainRegion.show(new HomeLayout());
            
        },
        main:function () {
            // var hasPushState = !!(window.history && history.pushState);
            // if(!hasPushState) 
            //     this.navigate(window.location.pathname.substring(1), {trigger: true, replace: true});
            // else 
                App.mainRegion.show(new MainLayout());
        }

    });
});