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

	return Backbone.Marionette.LayoutView.extend({
		 //Template HTML string
        template: Handlebars.compile(template),

		initialize: function(options){
			this.options = options;	
		},
		regions: {
			loginRegion: "#loginRegion",
			aboutRegion: "#aboutRegion"
		},
		onRender: function() {
			if(this.options.action === "signup"){
				this.signupView = new SignupView();
				this.signupView.on("click:login:show", this.signuptoLoginViewTriggers.bind(this));

				this.loginRegion.show(this.signupView);
			} else if(this.options.action === "forgotpassword"){
				this.forgotPasswordView = new ForgotPasswordView();
				this.forgotPasswordView.on("click:login:show", this.forgotPasswordtoLoginViewTriggers.bind(this));	

				this.loginRegion.show(this.forgotPasswordView);
			} else if(this.options.action === "changepassword") {
				if(this.options.action === "changepassword"){
					this.changePasswordView = new ChangePasswordView({
						id: this.options.id
					});
				} else {
					this.changePasswordView = new ChangePasswordView({
						id: ""
					});
				}
				this.changePasswordView.on("click:login:show", this.changePasswordtoLoginViewTriggers.bind(this));

				this.loginRegion.show(this.changePasswordView);
			} else if(this.options.action === "verifyemail"){
				if(this.options.action === "verifyemail" && this.options.id && this.options.id !== "" ){
					this.verifyEmailView = new VerifyEmailView({
						id: this.options.id
					});
				} else{
					this.verifyEmailView = new VerifyEmailView({
						id: ""
					});
				}
				this.verifyEmailView.on("click:login:show", this.verifyEmailtoLoginViewTriggers.bind(this));

				this.loginRegion.show(this.verifyEmailView);
			} else {
				this.loginView = new LoginView();
				this.loginView.on("click:signup:show", this.logintoSignupViewTriggers.bind(this));
				this.loginView.on("click:forgotPassword:show", this.logintoForgotPasswordViewTriggers.bind(this));

				this.loginRegion.show(this.loginView);
			}
			this.aboutRegion.show(new AboutView());
			$("body").removeClass("f-topbar-fixed");
			$(window).scrollTop(0);
		},
		onShow: function() {
			$(document).foundation();
		},
		logintoSignupViewTriggers: function(){
	
			this.signupView = new SignupView();
			this.signupView.on("click:login:show", this.signuptoLoginViewTriggers.bind(this));
			this.loginRegion.show(this.signupView);
			Backbone.history.navigate('home/signup');

			/* When signup view is shown, the login view has been destroyed
			 * Thus, we re-instantiate login view rebind the signup show and forgot password show
			 */
			this.loginView = new LoginView();
			this.loginView.on("click:signup:show", this.logintoSignupViewTriggers.bind(this));
			this.loginView.on("click:forgotPassword:show", this.logintoForgotPasswordViewTriggers.bind(this));
		},
		signuptoLoginViewTriggers: function() {

			this.loginView = new LoginView();
			this.loginView.on("click:signup:show", this.logintoSignupViewTriggers.bind(this));
			this.loginView.on("click:forgotPassword:show", this.logintoForgotPasswordViewTriggers.bind(this));
			this.loginRegion.show(this.loginView);
			Backbone.history.navigate('home');

			/* When login view is shown, the signup view has been destroyed
			 * Thus, we re-instantiate signup view and rebind the login show
			 */
			this.signupView = new SignupView();
			this.signupView.on("click:login:show", this.signuptoLoginViewTriggers.bind(this));
		},
		logintoForgotPasswordViewTriggers: function() {

			this.forgotPasswordView = new ForgotPasswordView();
			this.forgotPasswordView.on("click:login:show", this.forgotPasswordtoLoginViewTriggers.bind(this));
			this.loginRegion.show(this.forgotPasswordView);
			Backbone.history.navigate('home/forgotpassword');

			/* When forgot password view is shown, the login view has been destroyed
			 * Thus, we re-instantiate login view and rebind the forgot password show and signup show
			 */
			this.loginView = new LoginView();
			this.loginView.on("click:forgotPassword:show", this.logintoForgotPasswordViewTriggers.bind(this));
			this.loginView.on("click:signup:show", this.logintoSignupViewTriggers.bind(this));	
		},
		forgotPasswordtoLoginViewTriggers: function(){
			
			this.loginView = new LoginView();
			this.loginView.on("click:signup:show", this.logintoSignupViewTriggers.bind(this));
			this.loginView.on("click:forgotPassword:show", this.logintoForgotPasswordViewTriggers.bind(this));
			this.loginRegion.show(this.loginView);
			Backbone.history.navigate('home');

			/* When login view is shown, the forgot password view has been destroyed
			 * Thus, we re-instantiate forgot password view and rebind the login show
			 */
			this.forgotPasswordView = new ForgotPasswordView();
			this.forgotPasswordView.on("click:login:show", this.forgotPasswordtoLoginViewTriggers.bind(this));
		},
		changePasswordtoLoginViewTriggers: function(){
			
			this.loginView = new LoginView();
			this.loginView.on("click:signup:show", this.logintoSignupViewTriggers.bind(this));
			this.loginView.on("click:forgotPassword:show", this.logintoForgotPasswordViewTriggers.bind(this));
			this.loginRegion.show(this.loginView);
			Backbone.history.navigate('home');

			/* When login view is shown, the change password view has been destroyed
			 * Thus, we re-instantiate change password view and rebind the login show
			 */
			this.changePasswordView = new ChangePasswordView();
			this.changePasswordView.on("click:login:show", this.changePasswordtoLoginViewTriggers.bind(this));
		},
		verifyEmailtoLoginViewTriggers: function() {

			this.loginView = new LoginView();
			this.loginView.on("click:signup:show", this.logintoSignupViewTriggers.bind(this));
			this.loginView.on("click:forgotPassword:show", this.logintoForgotPasswordViewTriggers.bind(this));
			this.loginRegion.show(this.loginView);
			Backbone.history.navigate('home');

			/* When login view is shown, the change verify email view has been destroyed
			 * Thus, we re-instantiate verify email view and rebind the login show
			 */
			self.verifyEmailView = new VerifyEmailView();
			self.verifyEmailView.on("click:login:show", this.verifyEmailtoLoginViewTriggers.bind(this));
		}
	});
});