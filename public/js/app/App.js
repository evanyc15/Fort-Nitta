define([
    'jquery', 
    'backbone', 
    'marionette', 
    'underscore', 
    'handlebars',
    'models/SessionModel'
    ], function ($, Backbone, Marionette, _, Handlebars, SessionModel) {
        var App = new Backbone.Marionette.Application();

        //Organize Application into regions corresponding to DOM elements
        //Regions can contain views, Layouts, or subregions nested as necessary
        App.addRegions({
            mainRegion:"#main"
        });

        function isMobile() {
            var ua = (navigator.userAgent || navigator.vendor || window.opera, window, window.document);
            return (/iPhone|iPod|iPad|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
        }

        App.mobile = isMobile();

        // App.addInitializer(function (options) {
        //     Backbone.history.start();
        // });

        $.ajaxSetup({ cache: false }); 

        return App;
    });