define([
	'jquery',
	'backbone',
	'marionette',
	'underscore',
	'handlebars',
	'views/Home_LoginView',
	'views/Home_SignupView',
	'views/Home_ForgotPasswordView',
	'views/Home_AboutView',
	'text!templates/home_layout.html'
],  function ($, Backbone, Marionette, _, Handlebars, LoginView, SignupView, ForgotPasswordView, AboutView, template) {

	"use strict";

	return Backbone.Marionette.Layout.extend({
		 //Template HTML string
        template: Handlebars.compile(template),

		initialize: function(options){
			this.options = options;
			this.loginView = new LoginView();
			this.signupView = new SignupView();
			this.forgotPasswordView = new ForgotPasswordView();
			this.aboutView = new AboutView();	

			this.loginView.on("click:signup:show", this.logintoSignupViewTriggers.bind(this));
			this.signupView.on("click:login:show", this.signuptoLoginViewTriggers.bind(this));
			this.loginView.on("click:forgotPassword:show", this.logintoForgotPasswordViewTriggers.bind(this));
			this.forgotPasswordView.on("click:login:show", this.forgotPasswordtoLoginViewTriggers.bind(this));	
		},
		regions: {
			loginRegion: "#loginRegion",
			aboutRegion: "#aboutRegion"
		},
		logintoSignupViewTriggers: function(){
			var self = this;

			self.loginRegion.show(self.signupView);

			/* When signup view is shown, the login view has been destroyed
			 * Thus, we re-instantiate login view rebind the signup show and forgot password show
			 */
			self.loginView = new LoginView();
			self.loginView.on("click:signup:show", self.logintoSignupViewTriggers.bind(this));
			self.loginView.on("click:forgotPassword:show", this.logintoForgotPasswordViewTriggers.bind(this));
		},
		signuptoLoginViewTriggers: function() {
			var self = this;

			self.loginRegion.show(self.loginView);

			/* When login view is shown, the signup view has been destroyed
			 * Thus, we re-instantiate signup view and rebind the login show
			 */
			self.signupView = new SignupView();
			self.signupView.on("click:login:show", self.signuptoLoginViewTriggers.bind(this));
		},
		logintoForgotPasswordViewTriggers: function() {
			var self = this;

			self.loginRegion.show(self.forgotPasswordView);

			/* When forgot password view is shown, the login view has been destroyed
			 * Thus, we re-instantiate login view and rebind the forgot password show and signup show
			 */
			self.loginView = new LoginView();
			self.loginView.on("click:forgotPassword:show", this.logintoForgotPasswordViewTriggers.bind(this));
			self.loginView.on("click:signup:show", self.logintoSignupViewTriggers.bind(this));	
		},
		forgotPasswordtoLoginViewTriggers: function(){
			var self = this;

			self.loginRegion.show(self.loginView);

			/* When login view is shown, the forgot password view has been destroyed
			 * Thus, we re-instantiate forgot password view and rebind the login show
			 */
			self.forgotPasswordView = new ForgotPasswordView();
			self.forgotPasswordView.on("click:login:show", this.forgotPasswordtoLoginViewTriggers.bind(this));
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