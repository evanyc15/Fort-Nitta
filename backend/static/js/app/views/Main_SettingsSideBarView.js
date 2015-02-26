/* RequireJS Module Dependency Definitions */
define([
    'app',
    'jquery',
    'marionette',
    'handlebars',
    'text!templates/main_settingssidebar.html'
], function (App, $, Marionette, Handlebars, template){
    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),

        initialize: function(options){
            this.options = options;
        },
        events: {
            "click #settingschange": "settingschange",
            "click #settingsemailnot": "settingsemailnot"
        },
        onBeforeDestroy: function() {
            this.unbind();
        },
        settingschange: function() {
            this.$(".custom_accordion li").removeClass("active");
            this.$el.find("#settingschange").addClass("active");
            this.trigger("click:settingschange:show");
        },
        settingsemailnot: function() {
            this.$(".custom_accordion li").removeClass("active");
            this.$el.find("#settingsemailnot").addClass("active");
            this.trigger("click:email&not:show");
        }

    });
});