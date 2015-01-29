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

			var width = $(window).width();
			var height = $(window).height();
			var self = this;

			$(window).on("resize", function(){

				if($(window).width() != width){
					width = $(window).width();
					self.$el.find("#playersDisplayButton").removeClass("playersDisplayShown").addClass("playersDisplayHidden");
					self.trigger("click:playersDisplay:hide");
				} else if($(window).height() != height){
					height = $(window).height();
					$("#playerList").height(height-110);
				}
			});
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
			this.$el.find("#playerList").height($(window).height()-110);
		}
		
	});
});