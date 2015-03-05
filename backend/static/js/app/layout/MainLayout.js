define([
	'app',
	'jquery',
	'backbone',
	'marionette',
	'underscore',
	'handlebars',
	'models/SessionModel',
	//'models/GameInfoModel',
	'text!templates/main_layout.html',
	'views/Main_TopBarView',
	'views/Main_PlayersView',
	'views/Main_ProfileView',
	'layout/Main_SettingsLayout',
	'layout/Main_MessagesLayout',
	'layout/Main_ForumsLayout',
	'views/Main_LeaderboardsView',
	'views/Main_AnnouncementsView',
	'layout/Main_AdminLayout',
	'cookie',
	'foundation',
	'foundation-topbar',
	'foundation-datatables',
	'imagesloaded'
],  function (App, $, Backbone, Marionette, _, Handlebars, SessionModel, template, TopBarView, PlayersView, MyProfileView, SettingsLayout, MessagesLayout, ForumsLayout, LeaderboardsView, AnnouncementsView, AdminLayout) {

	"use strict";

	return Backbone.Marionette.LayoutView.extend({
		 //Template HTML string
        template: Handlebars.compile(template),

		initialize: function(options){
			this.options = options;
			this.checkPageLoad();
		},
		regions: {
			topbarRegion: "#topbarRegion",
			playersRegion: "#playersRegion",
			contentRegion: "#contentRegion"
		},
		childEvents: {
			"click:playersDisplay:show": function(){
				$("#contentArea").removeClass("contentShow").addClass("contentHide");
				$("#playersRegion").removeClass("playersHide").addClass("playersShow");
			},
			"click:playersDisplay:hide": function() {
				$("#contentArea").removeClass("contentHide").addClass("contentShow");
				$("#playersRegion").removeClass("playersShow").addClass("playersHide");
			},
			"click:settings:show": function() {
				this.contentRegion.show(new SettingsLayout());
				Backbone.history.navigate('main/settings');
			},
			"click:myprofile:show": function() {
				this.contentRegion.show(new MyProfileView());
				Backbone.history.navigate('main/myprofile');
			},
			"click:messages:show": function() {
				this.contentRegion.show(new MessagesLayout());
				Backbone.history.navigate('main/messages');
			},
			"click:forums:show": function() {
				this.contentRegion.show(new ForumsLayout());
				Backbone.history.navigate('main/forums');
			},
			"click:leaderboards:show": function() {
				this.contentRegion.show(new LeaderboardsView());
				Backbone.history.navigate('main/leaderboards');
			},
			"click:announcements:show": function() {
				this.contentRegion.show(new AnnouncementsView());
				Backbone.history.navigate('main/announcements');
			},
			"click:admin:show": function() {
				this.contentRegion.show(new AdminLayout());
				Backbone.history.navigate('main/admin');
			}

		},
		onRender: function() {
			var self = this;
			this.topbarRegion.show(new TopBarView());
			this.playersRegion.show(new PlayersView());
			
			if(this.options.action === "settings"){
				this.contentRegion.show(new SettingsLayout());
			} else if(this.options.action === "messages"){
				this.contentRegion.show(new MessagesLayout());
			} else if(this.options.action === "forums"){
				if(this.options.id && this.options.id != ""){
					var id = parseInt(self.options.id.substring(3));
					this.contentRegion.show(new ForumsLayout({
						action: self.options.action2,
						id: id
					}));
				} else{
					this.contentRegion.show(new ForumsLayout({
						action: self.options.action2
					}));
				}
			} else if(this.options.action === "leaderboards"){
				this.contentRegion.show(new LeaderboardsView());
			} else if(this.options.action === "announcements"){
				this.contentRegion.show(new AnnouncementsView());
			} else if(this.options.action === "admin"){
				this.contentRegion.show(new AdminLayout());
			} else{
				this.contentRegion.show(new MyProfileView())
			}
		},
		onShow: function() {
			$(document).foundation();
		},
		checkPageLoad: function(){
			if(!$("#parallax-pageLoadImg").hasClass("iconBlink")){
				$("#parallax-pageLoadImg").addClass("iconBlink");
			}
			$("#parallax-pageLoadMeter").css('width','0');
			$("#parallax-pageLoadHeader").text("Loading Main Page")
			$("#parallax-pageLoad").css('display','block');
			
			checkTopBar();
			function checkTopBar(){
				var interval = setInterval(function(){
			   		if ($('nav.top-bar').length !== 0) {
					    clearInterval(interval);
					    checkTopBarMsg();
					    $("#parallax-pageLoadMeter").css('width','25%');
					}
			    },100);
			}
			function checkTopBarMsg(){
				var interval = setInterval(function(){
					if($("#topbar_messageContainer").length != 0){
						clearInterval(interval);
					    checkPlayerList();
					    $("#parallax-pageLoadImg").css('opacity',0.4);
					    $("#parallax-pageLoadMeter").css('width','45%');
					}
				},100);
			}
			function checkPlayerList(){
				var interval = setInterval(function(){
			    	if ($('#playerList').length !== 0) {
					    clearInterval(interval);
					    checkContentArea();
					    $("#parallax-pageLoadImg").css('opacity',0.75);
					    $("#parallax-pageLoadMeter").css('width','65%');			
					}
			    },100);
			}
			function checkContentArea(){
				var interval = setInterval(function(){
					if ($('#contentArea').length !== 0) {
						$("#contentArea").imagesLoaded(function(){
						    clearInterval(interval);
						    $("#parallax-pageLoadImg").css('opacity',1);
						    $("#parallax-pageLoadMeter").css('width','100%');
						    setTimeout(function() {
						    	$("#parallax-pageLoadImg").removeClass("iconBlink");
						    	$("#parallax-pageLoad").fadeOut();
						      	$("#topbarRegion").fadeIn();
						      	$("#contentArea").fadeIn();
						      	$("#playersRegion").fadeIn();
							}, 1000);	
						});
					}
			    },100);
			}
		},
	});
});