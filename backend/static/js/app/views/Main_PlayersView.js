/* RequireJS Module Dependency Definitions */
define([
	'app',
	'marionette',
	'handlebars',
    'collections/PlayersCollection',
	'text!templates/main_players.html'
], function (App, Marionette, Handlebars, PlayersCollection, template){

	"use strict";

	return Marionette.ItemView.extend({
		//Template HTML string
        template: Handlebars.compile(template),
        collection: new PlayersCollection(),

		initialize: function(options){
			this.options = options;

			var width = $(window).width();
			var height = $(window).height();
            var self = this;

            // Detects a windows change, if vertical, it resizes the player bar, if horizontal, it shrinks the player bar.
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

            this.playersArray = [];
            // SSE Eventsource listener to get online players for players list
			var sse = new EventSource('/stream');
            sse.addEventListener('message', function(e) {

            	var results = JSON.parse(e.data);
                // console.log(results);
				var i, j;   

                self.collection.each(function(data) {
                    var flag = false;
                    for(i = 0; i < results.length; i++){
                        if(typeof data !== "undefined"){
                            if(data.get('id') === results[i].id){
                                flag = true;
                                break;
                            }
                        } 
                    }
                    if(!flag){
                        self.collection.remove(data.get('id'));
                    }
                });
                 // TESTING COLLECTIONS HERE
                self.collection.add(results, {merge: true});

                var html = self.template(self.collection.toJSON());
                self.$el.html(html);
    			}, false);
		},
		events: {
			"click #playersDisplayButton": "playersDisplay"
		},
        onRender: function() {
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