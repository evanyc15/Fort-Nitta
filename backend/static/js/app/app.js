/// @file app.js
/// Organizes the app into regions, corresponding to the DOM, and sets AJAX calls

define([
    'jquery', 
    'backbone', 
    'marionette', 
    'underscore', 
    'handlebars',
    'models/SessionModel'
    ], function ($, Backbone, Marionette, _, Handlebars, SessionModel) {
        'use strict';
        
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
        $.ajaxSetup({ cache: false });          // force ajax call on all browser
        App.addInitializer(function (options) {
            Backbone.history.start();
        });

        Backbone.View.prototype.close = function(){
            this.remove();
            this.unbind();
            if (this.onClose){
                this.onClose();
            }
        };

        return App;
    });