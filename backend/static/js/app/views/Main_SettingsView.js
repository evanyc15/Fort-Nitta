define([
    'app',
    'marionette',
    'handlebars',
    'text!templates/main_settings.html'
], function (App, Marionette, Handlebars, template){
    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),

        initialize: function(options){
            this.options = options;
        },
        events: {
            "click #settingsSubmitButton": "changeDetails",
		    "click #settingsCancelButton": "cancel"   
        },
		changeDetails: function(event){
			var self = this;
			console.log("changeDetails invoked");
			App.session.changeDetails({
				username: App.session.user.get("username"),
				password: this.$("#passwordInput").val(),
				first_name: this.$("#firstnameInput").val(),
				last_name: this.$("#lastnameInput").val(),
				email: this.$("#emailInput").val(),
				
			});
		},
		
		cancel: function(event){
		    console.log("Cancel button invoked")
		}
		
    });
});