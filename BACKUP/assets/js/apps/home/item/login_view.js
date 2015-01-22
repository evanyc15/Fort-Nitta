define([
	"marionette",
	"backbone",
	"js/apps/home/templates/templates"
], function (Marionette, Backbone, Templates){

	"use strict";

	return Backbone.Marionette.ItemView.extend({
		template: Templates.loginBox,

		initialize: function(options){
			this.options = options;
		}

		// events: {
		// 	"click #signupButton": "signUpShow",
		// 	"click #backLoginButton": "loginShow"
		// }

		
	})
});