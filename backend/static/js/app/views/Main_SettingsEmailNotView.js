/* RequireJS Module Dependency Definitions */
define([
    'app',
    'marionette',
    'handlebars',
    'text!templates/main_settingsemailnot.html'
], function (App, Marionette, Handlebars, template){

    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),

        initialize: function(options){
            this.options = options;
        }

        // events: {
        //  "click #signupButton": "signUpShow",
        //  "click #backLoginButton": "loginShow"
        // },

        
    });
});