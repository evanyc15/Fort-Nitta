define([
	"marionette", 
	"backbone",
	"js/apps/home/templates/templates",
	"js/apps/home/item/login_view",
	"js/apps/home/item/signup_view"
],  function (Marionette, Backbone, Templates, LoginView, SignupView) {

	"use strict";

	return Backbone.Marionette.Layout.extend({
		template: Templates.layout,

		initialize: function(options){
			this.options = options;
			this.loginView = new LoginView();
			this.signupView = new SignupView();
		},

		regions: {
			loginArea: "#loginArea"
		},

		// onRender: {
		// 	this.loginArea.show(loginView);
		// }
	})
});