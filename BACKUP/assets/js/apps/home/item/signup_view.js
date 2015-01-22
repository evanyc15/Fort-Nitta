define([
	"marionette",
	"js/apps/home/templates/templates"
], function (Marionette, Backbone, Templates){

	"use strict";

	return Marionette.ItemView.extend({
		template: Templates.signupBox,

		initialize: function(options){
			this.options = options;
		}

		// events: {
		// 	"click #signupButton": "signUpShow",
		// 	"click #backLoginButton": "loginShow"
		// },

		
	})
});