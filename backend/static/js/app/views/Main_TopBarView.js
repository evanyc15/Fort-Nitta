define([
	'app',
	'jquery',
	'marionette',
	'handlebars',
	'text!templates/main_topbar.html',
	'foundation-reveal'
], function (App, $, Marionette, Handlebars, template){

	"use strict";

	return Marionette.ItemView.extend({
		//Template HTML string
        template: Handlebars.compile(template),

		initialize: function(options){
			this.options = options;	
		},
		events: {
			"click #logoutButton": "logout",
			"click #topbarSettings": "settings",
			"click #topBarMyProfile": "myprofile"
		},
		onRender: function(){
			var html = this.template(App.session.user.toJSON());
			this.$el.html(html);
		},
		onShow: function() {
			// this.detectUserAgent();
		},
		detectUserAgent: function() {
			var userAgent;
			var fileType;
			if(navigator.userAgent.match(/Android/g)) {
				userAgent = "You are using an Android";
				fileType = ".apk";
			} else if(navigator.userAgent.match(/iPhone/g)){
				userAgent = "iPhone";
				fileType = ".ipa";
			} else if(navigator.userAgent.match(/Windows/g)){
				userAgent = "Windows";
				fileType = ".exe";
			} else if(navigator.userAgent.match(/Mac/g)){
				userAgent = "Mac";
				fileType = ".dmg";
			} else if(navigator.userAgent.match(/Linux/g)){
				userAgent = "Linux";
				fileType = ".deb";
			}
			this.$el.find("#modalPlatform").html("You have the following OS: "+userAgent);
			this.$el.find("#modalDownload").html("Download the "+fileType+" on the right to begin playing the game! -->");
			this.$el.find("#myModal").foundation('reveal','open');
		},
		settings: function(){
			this.trigger("click:settings:show");
		},
		myprofile: function() {
			this.trigger("click:myprofile:show");
		},
		logout: function(event) {
			event.stopPropagation();
      		event.preventDefault();

			App.session.logout({
			},{
				success: function(){
					console.log("Logged out");
					Backbone.history.navigate('home', {trigger: true});
				},
				error: function() {
					console.log("Logged out failed");
				}
			});
		}
		
	});
});