define([
	'jquery',
	'backbone',
	'marionette',
	'underscore',
	'handlebars',
	'views/Home_LoginView',
	'views/Home_SignupView',
	'views/Home_AboutView',
	'text!templates/home_layout.html'
],  function ($, Backbone, Marionette, _, Handlebars, LoginView, SignupView, AboutView, template) {

	"use strict";

	return Backbone.Marionette.Layout.extend({
		 //Template HTML string
        template: Handlebars.compile(template),

		initialize: function(options){
			this.options = options;
			this.loginView = new LoginView();
			this.signupView = new SignupView();
			this.aboutView = new AboutView();
		},

		regions: {
			loginRegion: "#loginRegion",
			aboutRegion: "#aboutRegion"
		},
		onRender: function() {
			this.loginRegion.show(this.loginView);
			this.aboutRegion.show(this.aboutView);
		},
		onShow: function() {
			$(document).foundation();
		}
	});
});