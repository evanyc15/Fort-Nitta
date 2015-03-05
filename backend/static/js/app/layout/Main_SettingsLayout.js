define([
    'app',
    'jquery',
    'backbone',
    'marionette',
    'underscore',
    'handlebars',
    'models/SessionModel',
    'text!templates/main_settingslayout.html',
    'views/Main_SettingsSideBarView',
    'views/Main_SettingsChangeView',
    'views/Main_SettingsEmailNotView',
    'cookie'
],  function (App, $, Backbone, Marionette, _, Handlebars, SessionModel, template, SettingsSideBarView, SettingsChangeView, SettingsEmailNotView) {

    "use strict";

    return Backbone.Marionette.LayoutView.extend({
         //Template HTML string
        template: Handlebars.compile(template),

        initialize: function(options){
            this.options = options;
        },
        regions: {
            sidebarRegion: "#sidebarRegion",
            contentRegion: "#settingsRegion"
        },
        childEvents: {
            "click:settingschange:show": function() {
                this.contentRegion.show(new SettingsChangeView());
            },
            "click:email&not:show": function() {
                this.contentRegion.show(new SettingsEmailNotView());
            }
        },
        onRender: function() {
            this.sidebarRegion.show(new SettingsSideBarView());
            this.contentRegion.show(new SettingsChangeView());
        }
    });
});