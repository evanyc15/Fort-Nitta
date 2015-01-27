define([
	'App',
	'jquery',
	'backbone',
	'marionette',
	'underscore',
	'handlebars',
	'models/SessionModel',
	'text!templates/main_layout.html',
	'views/Main_TopBarView',
	'views/Main_PlayersView',
	'views/Main_ProfileView'
],  function (App, $, Backbone, Marionette, _, Handlebars, SessionModel, template, TopBarView, PlayersView, ProfileView) {

	"use strict";

	return Backbone.Marionette.Layout.extend({
		 //Template HTML string
        template: Handlebars.compile(template),

		initialize: function(options){
			this.options = options;
			this.topbarView = new TopBarView();
			this.playersView = new PlayersView();
			this.profileView = new ProfileView();

			this.playersView.on("click:playersDisplay:show", function(){
				$("#contentArea").removeClass("contentShow").addClass("contentHide");
				$("#playersRegion").removeClass("playersHide").addClass("playersShow");
			});
			this.playersView.on("click:playersDisplay:hide", function(){
				$("#contentArea").removeClass("contentHide").addClass("contentShow");
				$("#playersRegion").removeClass("playersShow").addClass("playersHide");
			});
			console.log(App.session);
		},
		regions: {
			topbarRegion: "#topbarRegion",
			playersRegion: "#playersRegion",
			contentRegion: "#contentRegion"
		},
		onRender: function() {
			this.topbarRegion.show(this.topbarView);
			this.playersRegion.show(this.playersView);
			this.contentRegion.show(this.profileView);
		},
		onShow: function() {
			$(document).foundation();
		}
	});
});