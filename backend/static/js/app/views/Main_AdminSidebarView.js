/* RequireJS Module Dependency Definitions */
define([
    'app',
    'jquery',
    'marionette',
    'handlebars',
    'text!templates/main_adminsidebar.html'
], function (App, $, Marionette, Handlebars, template){
    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),

        initialize: function(options){
            this.options = options;
        },
        events: {
            "click #adminglobalannouncements": "adminglobalannouncements",
            "click #adminprivileges": "adminprivileges"
        },
        onBeforeDestroy: function() {
            this.unbind();
        },
        adminglobalannouncements: function() {
            this.$(".custom_accordion li").removeClass("active");
            this.$el.find("#adminglobalannouncements").addClass("active");
            this.triggerMethod("click:globalannouncements:show");
        },
        adminprivileges: function() {
            this.$(".custom_accordion li").removeClass("active");
            this.$el.find("#adminprivileges").addClass("active");
            this.triggerMethod("click:privilges:show");
        }
    });
});