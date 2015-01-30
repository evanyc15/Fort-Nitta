define([
    'App',
    'jquery',
    'marionette',
    'handlebars',
    'text!templates/home_changePasswordBox.html'
], function (App, $, Marionette, Handlebars, template){

    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),

        initialize: function(options){
            this.options = options;
        },
        events: {
           "click #backLoginButton": "loginShow",
           "click #passwordRecButton": "changePassword"
        },
        loginShow: function() {
            this.trigger("click:login:show");
        },
        changePassword: function(event) {
            
        }
    });
});