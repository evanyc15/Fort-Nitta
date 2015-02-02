define([
	'app',
	'jquery',
	'backbone',
	'marionette',
	'underscore',
	'handlebars',
	'views/Home_LoginView',
	'views/Home_SignupView',
	'views/Home_ForgotPasswordView',
	'views/Home_ChangePasswordView',
	'views/Home_VerifyEmailView',
	'views/Home_AboutView',
	'text!templates/home_layout.html'
],  function (App, $, Backbone, Marionette, _, Handlebars, LoginView, SignupView, ForgotPasswordView, ChangePasswordView, VerifyEmailView, AboutView, template) {

	"use strict";

	return Backbone.Marionette.Layout.extend({
		 //Template HTML string
        template: Handlebars.compile(template),

		initialize: function(options){
			this.options = options;

			this.loginView = new LoginView();
			this.signupView = new SignupView();
			this.forgotPasswordView = new ForgotPasswordView();
			if(this.options.action === "changepassword"){
				this.changePasswordView = new ChangePasswordView({
					id: this.options.id
				});
			} else {
				this.changePasswordView = new ChangePasswordView({
					id: ""
				});
			}
			if(this.options.action === "verifyemail" && this.options.id && this.options.id !== "" ){
				this.verifyEmailView = new VerifyEmailView({
					id: this.options.id
				});
			} else{
				this.verifyEmailView = new VerifyEmailView({
					id: ""
				});
			}
			this.aboutView = new AboutView();	

			this.loginView.on("click:signup:show", this.logintoSignupViewTriggers.bind(this));
			this.signupView.on("click:login:show", this.signuptoLoginViewTriggers.bind(this));
			this.loginView.on("click:forgotPassword:show", this.logintoForgotPasswordViewTriggers.bind(this));
			this.forgotPasswordView.on("click:login:show", this.forgotPasswordtoLoginViewTriggers.bind(this));	
			this.changePasswordView.on("click:login:show", this.changePasswordtoLoginViewTriggers.bind(this));
			this.verifyEmailView.on("click:login:show", this.verifyEmailtoLoginViewTriggers.bind(this));
		},
		regions: {
			loginRegion: "#loginRegion",
			aboutRegion: "#aboutRegion"
		},
		onRender: function() {
			if(this.options.action === "signup"){
				this.loginRegion.show(this.signupView);
			} else if(this.options.action === "forgotpassword"){
				this.loginRegion.show(this.forgotPasswordView);
			} else if(this.options.action === "changepassword") {
				this.loginRegion.show(this.changePasswordView);
			} else if(this.options.action === "verifyemail"){
				this.loginRegion.show(this.verifyEmailView);
			} else {
				this.loginRegion.show(this.loginView);
			}
			this.aboutRegion.show(this.aboutView);

		},
		onShow: function() {
			$(document).foundation();
		},
		logintoSignupViewTriggers: function(){
			var self = this;

			self.loginRegion.show(self.signupView);
			Backbone.history.navigate('home/signup');

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
			Backbone.history.navigate('home');

			/* When login view is shown, the signup view has been destroyed
			 * Thus, we re-instantiate signup view and rebind the login show
			 */
			self.signupView = new SignupView();
			self.signupView.on("click:login:show", self.signuptoLoginViewTriggers.bind(this));
		},
		logintoForgotPasswordViewTriggers: function() {
			var self = this;

			self.loginRegion.show(self.forgotPasswordView);
			Backbone.history.navigate('home/forgotpassword');

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
			Backbone.history.navigate('home');

			/* When login view is shown, the forgot password view has been destroyed
			 * Thus, we re-instantiate forgot password view and rebind the login show
			 */
			self.forgotPasswordView = new ForgotPasswordView();
			self.forgotPasswordView.on("click:login:show", this.forgotPasswordtoLoginViewTriggers.bind(this));
		},
		changePasswordtoLoginViewTriggers: function(){
			var self = this;

			self.loginRegion.show(self.loginView);
			Backbone.history.navigate('home');

			/* When login view is shown, the change password view has been destroyed
			 * Thus, we re-instantiate change password view and rebind the login show
			 */
			self.changePasswordView = new ChangePasswordView();
			this.changePasswordView.on("click:login:show", this.changePasswordtoLoginViewTriggers.bind(this));
		},
		verifyEmailtoLoginViewTriggers: function() {
			var self = this;

			self.loginRegion.show(self.loginView);
			Backbone.history.navigate('home');

			/* When login view is shown, the change verify email view has been destroyed
			 * Thus, we re-instantiate verify email view and rebind the login show
			 */
			self.verifyEmailView = new VerifyEmailView();
			this.verifyEmailView.on("click:login:show", this.verifyEmailtoLoginViewTriggers.bind(this));
		}
	});
});