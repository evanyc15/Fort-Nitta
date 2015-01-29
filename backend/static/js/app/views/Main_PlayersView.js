define([
	'app',
	'marionette',
	'handlebars',
	'text!templates/main_players.html'
], function (App, Marionette, Handlebars, template){

	"use strict";

	return Marionette.ItemView.extend({
		//Template HTML string
        template: Handlebars.compile(template),

		initialize: function(options){
			this.options = options;
		},
		events: {
			"click #playersDisplayButton": "playersDisplay"
		},
		playersDisplay: function(){
			if(this.$el.find("#playersDisplayButton").hasClass("playersDisplayShown")){
				this.$el.find("#playersDisplayButton").removeClass("playersDisplayShown").addClass("playersDisplayHidden");
				this.trigger("click:playersDisplay:hide");
			} else if(this.$el.find("#playersDisplayButton").hasClass("playersDisplayHidden")){
				this.$el.find("#playersDisplayButton").removeClass("playersDisplayHidden").addClass("playersDisplayShown");
				this.trigger("click:playersDisplay:show");
			}
		},
		onShow: function(){
			console.log(this.$el.find("#playerList").height(300));
			console.log($("#playersRegion").height());
		}
		
	});
});