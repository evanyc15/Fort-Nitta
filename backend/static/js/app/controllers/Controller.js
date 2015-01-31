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
        index:function (action, id) {
            // Check the auth status upon initialization,
            // if logged in, redirect to main page

            App.session.checkAuth(function(loginStatus){
                if(!Backbone.History.started) Backbone.history.start();
                if(loginStatus){
                    if(typeof action != 'undefined' && action && typeof id === 'undefined' && !id){
                        Backbone.history.navigate('main/'+String(action), {trigger: true});
                    } else if(typeof action != 'undefined' && action && typeof id !== 'undefined' && id) {
                        Backbone.history.navigate('main/'+String(action)+"/"+String(id), {trigger: true});
                    } else {
                        Backbone.history.navigate('main', {trigger: true});
                    }
                } else {
                    App.mainRegion.show(new HomeLayout({
                        action: String(action).toLowerCase(),
                        id: String(id).toLowerCase()
                    }));
                }
            });          
        },
        main:function (action, id) {
            // Check the auth status upon initialization,
            // if logged in, continue to main page
        
            // console.log('Query variable %s not found', variable);


            App.session.checkAuth(function(loginStatus){
                if(!Backbone.History.started) Backbone.history.start();
                if(loginStatus){
                    App.mainRegion.show(new MainLayout({
                        action: String(action).toLowerCase(),
                        id: String(id).toLowerCase()
                    }));
                } else {
                    if(typeof action != 'undefined' && action && typeof id === 'undefined' && !id){
                        Backbone.history.navigate('home/'+String(action), {trigger: true});
                    } else if(typeof action != 'undefined' && action && typeof id !== 'undefined' && id) {
                        Backbone.history.navigate('home/'+String(action)+"/"+String(id), {trigger: true});
                    } else {
                        Backbone.history.navigate('home', {trigger: true});
                    }
                }
            });
                
        }

    });
});