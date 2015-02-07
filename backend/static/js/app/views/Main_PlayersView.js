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
                // console.log(results);
				var i, j;


                if(self.playersArray === undefined || self.playersArray.length == 0){
                    for(i = 0; i < results.length; i++){
                        var html = "<div class='row playerTile'>" +
                                    "<div class='hidTokPres' id='" + self.hashCode(results[i].last_name+results[i].username+results[i].first_name) + "'></div>" +
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
                    }
                } else if (self.playersArray.length > 0){
                    for(i = 0; i < self.playersArray.length; i++){
                        var flag = false;
                        for(j = 0; j < results.length; j++){
                            if(self.playersArray[i].username === results[j].username){
                                self.playersArray[i].game_online = results[j].game_online;
                                self.playersArray[i].web_online = results[j].web_online;

                                var id = '#' + self.hashCode(self.playersArray[i].last_name+self.playersArray[i].username+self.playersArray[i].first_name);
                                var object = self.$el.find(id).closest(".playerTile");

                                if(self.playersArray[i].game_online && object.find(".fa-gamepad").length === 0){
                                    object.find(".large-4").prepend("<i class='fa fa-gamepad playerTileStatus'></i>");
                                } else if(!self.playersArray[i].game_online && object.find(".fa-gamepad").length === 1){
                                    object.find(".fa-gamepad").remove();
                                }
                                if(self.playersArray[i].web_online && object.find(".fa-globe").length === 0){
                                    object.find(".large-4").append("<i class='fa fa-globe playerTileStatus'></i>");
                                } else if(!self.playersArray[i].web_online && object.find(".fa-globe").length === 1){
                                    object.find(".fa-globe").remove();
                                }
                                flag = true;
                            }
                        }
                        if(!flag){
                            var id = '#' + self.hashCode(self.playersArray[i].last_name+self.playersArray[i].username+self.playersArray[i].first_name);
                            self.$el.find(id).closest(".playerTile").remove();
                            self.playersArray.splice(i, 1);
                        }
                    }
                    for(i = 0; i < results.length; i++){
                        var flag = false;
                        for(j = 0; j < self.playersArray.length; j++){
                            if(results[i].username == self.playersArray[j].username){
                                flag = true;
                            }
                        }
                        if(!flag){
                            var html = "<div class='row playerTile'>" +
                                        "<div class='hidTokPres' id='" + self.hashCode(results[i].last_name+results[i].username+results[i].first_name) + "'></div>" +
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
                        }
                    }
                }
                    /*&& results.length > self.playersArray.length){
                    for(i = 0; i < results.length; i++){
                        var flag = false;
                        for(j = 0; j < self.playersArray.length; j++){
                            if(self.playersArray[j].username == results[i].username){
                                flag = true;
                            }
                        }
                        if(!flag){
                            var html = "<div class='row playerTile'>" +
                                        "<div class='hidTokPres' id='" + self.hashCode(results[i].last_name+results[i].username+results[i].first_name) + "'></div>" +
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
                        }
                    }
                } else if (self.playersArray.length > 0 && results.length < self.playersArray.length){
                    for(i = 0; i < self.playersArray.length; i++){
                        var flag = false;
                        for(j = 0; j < results.length; j++){
                            if(self.playersArray[i].username == results[j].username){
                                flag = true;
                            }
                        }
                        if(!flag){
                            var id = '#' + self.hashCode(self.playersArray[i].last_name+self.playersArray[i].username+self.playersArray[i].first_name);
                            self.$el.find(id).closest(".playerTile").remove();
                            self.playersArray.splice(i, 1);
                        }
                    }
                } else {
                    for(i = 0; i < self.playersArray.length; i++){
                        for(j = 0; j < results.length; j++){
                            if(self.playersArray[i].username === results[j].username){
                                self.playersArray[i].game_online = results[j].game_online;
                                self.playersArray[i].web_online = results[j].web_online;
                            }
                        }
                        var id = '#' + self.hashCode(self.playersArray[i].last_name+self.playersArray[i].username+self.playersArray[i].first_name);
                        var object = self.$el.find(id).closest(".playerTile");

                        if(self.playersArray[i].game_online && object.find(".fa-gamepad").length === 0){
                            object.find(".large-4").prepend("<i class='fa fa-gamepad playerTileStatus'></i>");
                        } else if(!self.playersArray[i].game_online && object.find(".fa-gamepad").length === 1){
                            object.find(".fa-gamepad").remove();
                        }
                        if(self.playersArray[i].web_online && object.find(".fa-globe").length === 0){
                            object.find(".large-4").append("<i class='fa fa-globe playerTileStatus'></i>");
                        } else if(!self.playersArray[i].web_online && object.find(".fa-globe").length === 1){
                            object.find(".fa-globe").remove();
                        }
                    }
                }*/
			}, false);
		},
		events: {
			"click #playersDisplayButton": "playersDisplay"
		},
		onShow: function(){
			this.$el.find("#playerList").height($(window).height()-110);
		},
        hashCode: function(s){
            return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
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