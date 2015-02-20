define([
    'app', 
    'backbone', 
    'marionette', 
    'models/SessionModel',
    'layout/HomeLayout',
    'layout/MainLayout',
    'cookie'
], function (App, Backbone, Marionette, SessionModel, HomeLayout, MainLayout) {
    'use strict';


    return Backbone.Marionette.Controller.extend({
        initialize: function (options) {
            // Create a new session model and scope it to the app global
            // This will be a singleton, which other modules can access
            App.session = new SessionModel({});
        },
        //gets mapped to in AppRouter's appRoutes
        index: function (action, id) {
            // Check the auth status upon initialization,
            // if logged in, redirect to main page
            App.session.checkAuth(function(loginStatus){
                if(loginStatus){
                    if(App.session.user.get('new_user') === 0){
                        if(action && action !== 'undefined' && id === 'undefined' && !id){
                            Backbone.history.navigate('main/'+String(action), {trigger: true});
                        } else if(action && action !== 'undefined' && id !== 'undefined' && id) {
                            Backbone.history.navigate('main/'+String(action)+"/"+String(id), {trigger: true});
                        } else {
                            Backbone.history.navigate('main', {trigger: true});
                        }
                    } else {    
                        App.session.logout({
                        },{
                            success: function(){
                                Backbone.history.navigate('home/verifyemail', {trigger: true});
                            },
                            error: function(xhr, textStatus, errorThrown ) {
                                if (textStatus == 'timeout') {
                                    this.tryCount++;
                                    if (this.tryCount <= this.retryLimit) {
                                        //try again
                                        $.ajax(this);
                                        return;
                                    }            
                                    return;
                                }
                            }
                        });
                    }  
                } else {
                    App.mainRegion.show(new HomeLayout({
                        action: String(action).toLowerCase(),
                        id: String(id)
                    }));
                }
            });          
        },
        main: function (action, action2, id) {

            // Check the auth status upon initialization,
            // if logged in, continue to main page

            App.session.checkAuth(function(loginStatus){
                
                if(loginStatus){
                    if(App.session.user.get('new_user') === 0){
                        App.mainRegion.show(new MainLayout({
                            action: String(action).toLowerCase(),
                            action2: String(action2).toLowerCase(),
                            id: String(id)
                        }));
                    } else {
                        App.session.logout({
                        },{
                            success: function(){
                                console.log("Logged out");          
                                Backbone.history.navigate('home/verifyemail', {trigger: true});
                            },
                            error: function(xhr, textStatus, errorThrown ) {
                                 if (textStatus == 'timeout') {
                                    this.tryCount++;
                                    if (this.tryCount <= this.retryLimit) {
                                        //try again
                                        $.ajax(this);
                                        return;
                                    }            
                                    return;
                                }
                            }
                        });
                    }   
                } else {
                    if(action && action !== 'undefined' && id === 'undefined' && !id){
                        Backbone.history.navigate('home/'+String(action), {trigger: true});
                    } else if(action && action !== 'undefined' && id !== 'undefined' && id) {
                        Backbone.history.navigate('home/'+String(action)+"/"+String(id), {trigger: true});
                    } else {
                        Backbone.history.navigate('home', {trigger: true});
                    }
                }
            });
                
        },
    });
});