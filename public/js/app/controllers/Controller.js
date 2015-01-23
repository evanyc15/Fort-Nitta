define([
    'App', 
    'backbone', 
    'marionette', 
    'layout/HomeLayout',
    'layout/MainLayout'
], function (App, Backbone, Marionette, HomeLayout, MainLayout) {
    return Backbone.Marionette.Controller.extend({
        initialize:function (options) {
            
        },
        //gets mapped to in AppRouter's appRoutes
        index:function () {
            App.mainRegion.show(new HomeLayout());
        },
        main:function () {
            App.mainRegion.show(new MainLayout());
        }

    });
});