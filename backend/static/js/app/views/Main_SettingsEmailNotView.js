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
        },
        events: {
            "click #settingsCancelButton": "cancel",
            "click #settingsSubmitButton": "submitEmailNot"
        },
        onBeforeDestroy: function() {
            this.unbind();
        },
        cancel: function(event){
			Backbone.history.navigate('main', {trigger: true}); 
		},
        submitEmailNot: function(event){
            var self = this;
            console.log("pressed submit ON EMAIL NOTIFICATION");
            console.log( self.$("#notificationSelect").val());
            console.log(App.session.user.get("username"));
            var jsonData = {"username": App.session.user.get("username"), "n_hour": self.$("#notificationSelect").val()};
            App.session.settings({
                data: jsonData
                },
                {
                    success: function(mod, res){
                        console.log("SUCCESS-changeEMAIL NOTIFICATION");
                        Backbone.history.navigate('main', {trigger: true});
                    },
                    error:function(data){
                        console.log("error in email notif change");
                    }
                });
            
        }

    });
});