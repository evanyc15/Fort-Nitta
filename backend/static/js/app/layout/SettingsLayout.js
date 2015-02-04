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

    return Backbone.Marionette.Layout.extend({
         //Template HTML string
        template: Handlebars.compile(template),

        initialize: function(options){
            this.options = options;
            var self = this;

            this.settingssidebarView = new SettingsSideBarView();
            
            this.settingssidebarView.on("click:settingschange:show", function(){
                self.contentRegion.show(new SettingsChangeView());
            });
            this.settingssidebarView.on("click:email&not:show", function() {
                self.contentRegion.show(new SettingsEmailNotView());
            });
        },
        regions: {
            sidebarRegion: "#sidebarRegion",
            contentRegion: "#contentRegion"
        },
        onRender: function() {
            this.sidebarRegion.show(this.settingssidebarView);
            this.contentRegion.show(new SettingsChangeView());
        }
    });
});