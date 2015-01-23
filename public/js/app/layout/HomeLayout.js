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

			this.loginView.on("click:signup:show", this.loginViewTriggers.bind(this));
			this.signupView.on("click:login:show", this.signupViewTriggers.bind(this));
			
		},

		regions: {
			loginRegion: "#loginRegion",
			aboutRegion: "#aboutRegion"
		},
		loginViewTriggers: function(){
			var self = this;

			self.loginRegion.show(self.signupView);

			self.loginView = new LoginView();
			self.loginView.on("click:signup:show", self.loginViewTriggers.bind(this));
		},
		signupViewTriggers: function() {
			var self = this;

			self.loginRegion.show(self.loginView);

			self.signupView = new SignupView();
			self.signupView.on("click:login:show", self.signupViewTriggers.bind(this));
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