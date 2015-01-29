define([
	'App',
	'marionette',
	'handlebars',
	'text!templates/home_signupBox.html'
], function (App, Marionette, Handlebars, template){

	"use strict";

	return Marionette.ItemView.extend({
		//Template HTML string
        template: Handlebars.compile(template),

		initialize: function(options){
			this.options = options;
		},
		events: {
			"click #backLoginButton": "loginShow",
			"click #signupSubmitButton": "signup"
		},
		loginShow: function(){
			this.trigger("click:login:show");
		},
		signup: function() {
			App.session.signup({
				username: this.$("#usernameInput").val(),
				password: this.$("#passwordInput").val(),
				email: this.$("#emailInput").val(),
                first_name: this.$("#firstnameInput").val(),
                last_name: this.$("#lastnameInput").val(),
            }, {
                success: function(mod, res){
                    // console.log("SUCCESS", mod, res);
                    console.log("SUCCESS");
                },
                error: function(err){
                    console.log("ERROR", err);
                }
            });
		}

		
	});
});