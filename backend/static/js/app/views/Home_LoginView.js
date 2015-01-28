define([
	'App',
	'jquery',
	'marionette',
	'handlebars',
	'text!templates/home_loginBox.html'
], function (App, $, Marionette, Handlebars, template){

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
		login:function (event){
	        event.stopPropagation();
      		event.preventDefault();

      		App.session.login({
                username: this.$("#usernameInput").val(),
                password: this.$("#passwordInput").val()
            }, {
                success: function(mod, res){
                    console.log("SUCCESS", mod, res);
                },
                error: function(err){
                    console.log("ERROR", err);
                    $("small.error").addClass("show");
                    setTimeout(function() {
					  $("small.error").removeClass("show");
					}, 5000);
                }
            });

      		
	    }
	});
});