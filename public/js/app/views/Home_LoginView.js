define([
	'app',
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
			// "click #signupButton": "signUpShow",
			// "click #backLoginButton": "loginShow",
			"click #loginButton": "login"
		},
		login: function(){
			Backbone.history.navigate('main', {trigger: true});
		}

		
	});
});