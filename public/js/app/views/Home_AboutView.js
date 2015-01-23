define([
	'app',
	'marionette',
	'handlebars',
	'text!templates/home_about.html'
], function (App, Marionette, Handlebars, template){

	"use strict";

	return Marionette.ItemView.extend({
		//Template HTML string
        template: Handlebars.compile(template),

		initialize: function(options){
			this.options = options;
		}

		// events: {
		// 	"click #signupButton": "signUpShow",
		// 	"click #backLoginButton": "loginShow"
		// },

		
	});
});