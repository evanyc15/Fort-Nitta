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
	'text!templates/home_layout.html',
	"pagepiling",
	'imagesloaded'
],  function (App, $, Backbone, Marionette, _, Handlebars, LoginView, SignupView, ForgotPasswordView, ChangePasswordView, VerifyEmailView, AboutView, template) {

	"use strict";

	return Backbone.Marionette.LayoutView.extend({
		 //Template HTML string
        template: Handlebars.compile(template),

		initialize: function(options){
			this.options = options;	
			this.checkPageLoad();
		},
		regions: {
			loginRegion: "#loginRegion",
			aboutRegion: "#aboutRegion"
		},
		childEvents: {
			"click:login:show": function(){
				this.loginRegion.show(new LoginView());
				Backbone.history.navigate('home');
			},
			"click:signup:show": function(){
				this.loginRegion.show(new SignupView());
				Backbone.history.navigate('home/signup');
			},
			"click:forgotPassword:show": function() {
				this.loginRegion.show(new ForgotPasswordView());
				Backbone.history.navigate('home/forgotpassword');
			}
		},
		onRender: function() {
			if(this.options.action === "signup"){
				this.loginRegion.show(new SignupView());
			} else if(this.options.action === "forgotpassword"){
				this.loginRegion.show(new ForgotPasswordView());
			} else if(this.options.action === "changepassword") {
				if(this.options.action === "changepassword"){
					this.loginRegion.show(new ChangePasswordView({
						id: this.options.id
					}));
				} else {
					this.loginRegion.show(new ChangePasswordView({
						id: ""
					}));
				}
			} else if(this.options.action === "verifyemail"){
				if(this.options.action === "verifyemail" && this.options.id && this.options.id !== "" ){
					this.loginRegion.show(new VerifyEmailView({
						id: this.options.id
					}));
				} else {
					this.loginRegion.show(new VerifyEmailView({
						id: ""
					}));
				}
			} else {
				this.loginRegion.show(new LoginView());
			}
			this.aboutRegion.show(new AboutView());
			$("body").removeClass("f-topbar-fixed");
			$(window).scrollTop(0);
			$(window).scroll(function () {
			    $("body").animate({"background-position":"50% " + ($(this).scrollTop() / 2) + "px"},{queue:false, duration:500});
			});
		},
		onShow: function() {
			var self = this;
			$(document).foundation();
		    $('#pagepiling').pagepiling({
		    	menu: null,
		        direction: 'vertical',
		        verticalCentered: true,
		        scrollingSpeed: 700,
		        easing: 'swing',
		        css3: true
		    });		    
		},
		checkPageLoad: function(){
			var self = this;
			if(!$("#parallax-pageLoadImg").hasClass("iconBlink")){
				$("#parallax-pageLoadImg").addClass("iconBlink");
			}
			$("#parallax-pageLoadMeter").css('width','0');
			$("#parallax-pageLoadHeader").text("Loading Home Page");
			$("#parallax-pageLoad").css('display','block');
			
			checkLoginSection();
			function checkLoginSection(){
				var interval = setInterval(function(){
					if (self.$('#home_loginSection').length !== 0) {
						self.$("#home_loginSection").imagesLoaded(function(){
						    clearInterval(interval);
						    checkAboutSection();
						    $("#parallax-pageLoadMeter").css('width','35%');
						});
					}
			    },100);
			}
			function checkAboutSection(){
				var interval = setInterval(function(){
			    	if (self.$('#home_aboutSection').length !== 0) {
					    clearInterval(interval);
					    checkScreenshotSection();
					    $("#parallax-pageLoadImg").css('opacity',0.4);
					    $("#parallax-pageLoadMeter").css('width','50%');			
					}
			    },100);
			}
			function checkScreenshotSection(){
				var interval = setInterval(function(){
					if (self.$('#home_screenshotSection').length !== 0) {
						self.$("#home_screenshotSection").imagesLoaded(function(){
							    clearInterval(interval);
							    checkFooterSection();
							    $("#parallax-pageLoadImg").css('opacity',0.5);
							    $("#parallax-pageLoadMeter").css('width','85%');
						});
					}
			    },100);
			}
			function checkFooterSection(){
				var interval = setInterval(function(){
			    	if (self.$('#home_footerSection').length !== 0) {
					    clearInterval(interval);
					    $("#parallax-pageLoadMeter").css('width','100%');
					    $("#parallax-pageLoadImg").css('opacity',1);
					    // This removes the pp-tablecell element that pagepiling puts in which causes styling issues
					    self.$el.find(".pp-tableCell").each(function(){
					    	$(this).removeClass();
					    	$(this).removeAttr('style');			
						});
						self.$el.find(".home_naviIcon").each(function(){
							self.$el.find("#home_loginSection").append($(this).clone(true));
							$(this).remove();
						});
					    setTimeout(function() {
					    	$("#parallax-pageLoadImg").removeClass("iconBlink");
					    	$("#parallax-pageLoad").fadeOut();
					      	$("section").fadeIn();
						}, 1000);	    
					}
			    },100);
			}	
		}
	});
});