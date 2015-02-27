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
	'cookie',
	'foundation',
	'foundation-topbar',
	'foundation-datatables'
],  function (App, $, Backbone, Marionette, _, Handlebars, SessionModel, template, TopBarView, PlayersView, MyProfileView, SettingsLayout, MessagesLayout, ForumsLayout, LeaderboardsView) {

	"use strict";

	return Backbone.Marionette.LayoutView.extend({
		 //Template HTML string
        template: Handlebars.compile(template),

		initialize: function(options){
			this.options = options;
			this.topbarView = new TopBarView();
			this.playersView = new PlayersView();
			var self = this;

			this.playersView.on("click:playersDisplay:show", function(){
				$("#contentArea").removeClass("contentShow").addClass("contentHide");
				$("#playersRegion").removeClass("playersHide").addClass("playersShow");
			});
			this.playersView.on("click:playersDisplay:hide", function(){
				$("#contentArea").removeClass("contentHide").addClass("contentShow");
				$("#playersRegion").removeClass("playersShow").addClass("playersHide");
			});
			this.topbarView.on("click:settings:show", function(){
				self.contentRegion.show(new SettingsLayout());
				Backbone.history.navigate('main/settings');
			});
			this.topbarView.on("click:myprofile:show", function(){
				self.contentRegion.show(new MyProfileView());
				Backbone.history.navigate('main/myprofile');
			});
			this.topbarView.on("click:messages:show", function(){
				self.contentRegion.show(new MessagesLayout());
				Backbone.history.navigate('main/messages');
			});
			this.topbarView.on("click:forums:show", function(){
				self.contentRegion.show(new ForumsLayout());
				Backbone.history.navigate('main/forums');
			});
			this.topbarView.on("click:leaderboards:show", function(){
				self.contentRegion.show(new LeaderboardsView());
				Backbone.history.navigate('main/leaderboards');
			});
			this.checkPageLoad();
		},
		regions: {
			topbarRegion: "#topbarRegion",
			playersRegion: "#playersRegion",
			contentRegion: "#contentRegion"
		},
		onRender: function() {
			var self = this;
			this.topbarRegion.show(this.topbarView);
			this.playersRegion.show(this.playersView);
			
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
			} else{
				//this.myProfileView = new MyProfileView();
				//this.myProfileView.options = {model: new GameInfoModel()}
				//this.contentRegion.show(this.myProfileView);
				this.contentRegion.show(new MyProfileView())
			}
		},
		onShow: function() {
			$(document).foundation();
		},
		checkPageLoad: function(){
			$("#parallax-pageLoadHeader").text("Loading Main Page")
			
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
					$("#contentArea").imagesLoaded(function(){
							if ($('#contentArea').length !== 0) {
						    clearInterval(interval);
						    $("#parallax-pageLoadImg").css('opacity',1);
						    $("#parallax-pageLoadMeter").css('width','100%');
						    setTimeout(function() {
						    	$("#parallax-pageLoad").fadeOut();
						      	$("#topbarRegion").fadeIn();
						      	$("#contentArea").fadeIn();
						      	$("#playersRegion").fadeIn();
							}, 1000);	
						}
					});
			    },100);
			}
		},
	});
});