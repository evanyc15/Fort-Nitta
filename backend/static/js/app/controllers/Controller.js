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
            this.index();
        },
        //gets mapped to in AppRouter's appRoutes
        index:function () {
            // Check the auth status upon initialization,
            // if logged in, redirect to main page
            App.session.checkAuth(function(loginStatus){
                if(!Backbone.History.started) Backbone.history.start();
                if(loginStatus){
                    Backbone.history.navigate('main', {trigger: true});
                } else {
                    Backbone.history.navigate('home', {trigger: true});
                    App.mainRegion.show(new HomeLayout());
                }
            });          
        },
        main:function () {
            // Check the auth status upon initialization,
            // if logged in, continue to main page
            App.session.checkAuth(function(loginStatus){
                if(!Backbone.History.started) Backbone.history.start();
                if(loginStatus){
                    Backbone.history.navigate('main', {trigger: true});
                    App.mainRegion.show(new MainLayout());
                } else {
                    Backbone.history.navigate('home', {trigger: true});
                }
            });
                
        }

    });
});