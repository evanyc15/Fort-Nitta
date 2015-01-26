define([
	'App',
	'marionette',
	'handlebars',
	'text!templates/home_loginBox.html'
], function (App, Marionette, Handlebars, template){

	"use strict";

	return Marionette.ItemView.extend({
		//Template HTML string
        template: Handlebars.compile(template),

		initialize: function(options){
			this.options = options;
		},
		events: {
			"click #signupButton": "signUpShow",
			"click #loginButton": "login"
		},
		signUpShow: function(){
			this.trigger("click:signup:show");
		},
		login:function (event) {
			console.log("Login clicked");
	        // $("loginInput").click();
	        event.stopPropagation();
      		event.preventDefault();

      		App.session.login({
                username: this.$("#usernameInput").val(),
                password: this.$("#passwordInput").val()
            }, {
                success: function(mod, res){
                    console.log("SUCCESS", mod, res);
                    App.session.trigger("change:logged_in");
                },
                error: function(err){
                    console.log("ERROR", err);
                }
            });

      		
	    }
	});
});