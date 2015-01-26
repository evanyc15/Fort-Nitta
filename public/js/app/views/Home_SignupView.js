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
                firstname: this.$("#firstnameInput").val(),
                lastname: this.$("#lastnameInput").val(),
                username: this.$("#usernameInput").val(),
                email: this.$("#emailInput").val(),
                password: this.$("#passwordInput").val(),
            }, {
                success: function(mod, res){
                    console.log("SUCCESS", mod, res);
                },
                error: function(err){
                    console.log("ERROR", err);
                }
            });
		}

		
	});
});