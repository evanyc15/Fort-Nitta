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
			this.playersArray = [];

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
			var sse = new EventSource('/stream');
            sse.addEventListener('message', function(e) {

            	var results = JSON.parse(e.data);
				var i, j;
                if(self.playersArray === undefined || self.playersArray.length == 0){
                    console.log("1");
                    for(i = 0; i < results.length; i++){
                        var html = "<div class='row playerTile'>" +
                                    "<div class='large-4 columns'>";
                        if(results[i].game_online){
                            html+= "<i class='fa fa-gamepad playerTileStatus'></i>";
                        }
                        if(results[i].web_online){
                            html+= "<i class='fa fa-globe playerTileStatus'></i>";
                        }
                        html+=  "</div>" + 
                                "<div class='large-8 columns playerName'>" +
                                    results[i].first_name + " " + results[i].last_name +
                                "</div>" +
                            "</div>";
                        self.$el.find("#playerList").append(html);
                        self.playersArray.push(results[i]);
                        console.log(self.playersArray);
                    }
                } else{
                    console.log("2");
                    for(i = 0; i < results.length; i++){
                        var holder = results[i];
                        var flag = false;
                        for(j = 0; j < self.playersArray.length; j++){
                            if(self.playersArray[j].username == holder.username){
                                flag = true;
                            }
                        }
                        if(!flag){
                            var html = "<div class='row playerTile'>" +
                                        "<div class='large-4 columns'>";
                            if(results[i].game_online){
                                html+= "<i class='fa fa-gamepad playerTileStatus'></i>";
                            }
                            if(results[i].web_online){
                                html+= "<i class='fa fa-globe playerTileStatus'></i>";
                            }
                            html+=  "</div>" + 
                                    "<div class='large-8 columns playerName'>" +
                                        results[i].first_name + " " + results[i].last_name +
                                    "</div>" +
                                "</div>";
                            self.$el.find("#playerList").append(html);
                            self.playersArray.push(results[i]);
                            console.log(self.playersArray);
                        }
                    }
                }
			}, false);
		},
		events: {
			"click #playersDisplayButton": "playersDisplay"
		},
		onShow: function(){
			this.$el.find("#playerList").height($(window).height()-110);
			var self = this;

			
			// var self = this;

			// $.ajax({
			// 	url: '/api/presence/online/',
			// 	type: 'GET',
			// 	crossDomain: true,
			// 	xhrFields: {
			// 		withCredentials: true
			// 	},
			// 	success: function(data){
			// 		var results = data.results;
			// 		var i;

			// 		for(i = 0; i < results.length; i++){
			// 			var html = "<div class='row playerTile'>" +
			// 							"<div class='large-4 columns'>";
			// 			if(results[i].game_online){
			// 				html+= "<i class='fa fa-gamepad playerTileStatus'></i>";
			// 			}
			// 			if(results[i].web_online){
			// 				html+= "<i class='fa fa-globe playerTileStatus'></i>";
			// 			}
			// 			html+=	"</div>" + 
			// 					"<div class='large-8 columns playerName'>" +
			// 						results[i].first_name + " " + results[i].last_name +
			// 					"</div>" +
			// 				"</div>";
			// 			self.$el.find("#playerList").prepend(html);
			// 		}
			// 	},
			// 	error: function(data){
			// 		console.log("error");
			// 	}
	  // 		});
		},
		playersDisplay: function(){
			if(this.$el.find("#playersDisplayButton").hasClass("playersDisplayShown")){
				this.$el.find("#playersDisplayButton").removeClass("playersDisplayShown").addClass("playersDisplayHidden");
				this.trigger("click:playersDisplay:hide");
			} else if(this.$el.find("#playersDisplayButton").hasClass("playersDisplayHidden")){
				this.$el.find("#playersDisplayButton").removeClass("playersDisplayHidden").addClass("playersDisplayShown");
				this.trigger("click:playersDisplay:show");
			}
		}
		
		
	});
});