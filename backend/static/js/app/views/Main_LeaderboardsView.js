/* RequireJS Module Dependency Definitions */
define([
    'app',
    'marionette',
    'handlebars',
    'text!templates/main_leaderboards.html',
    'collections/LeaderboardsCollection',
    'moment'
], function (App, Marionette, Handlebars, template, LeaderboardsCollection){
    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
    template: Handlebars.compile(template),
    collection: new LeaderboardsCollection(),

        initialize: function(options){
            this.options = options;

            // Reset collection because it is saved when using the "back" button which causes bugs
            this.collection.reset();

          
        },
        events: {
          
        },
        onRender: function(){
            this.getLeaderboardStatistics();

        },
        onBeforeDestroy: function(){
            this.unbind();
        },
        getLeaderboardStatistics: function() {
                var self = this;
		    $.ajax({
		      url: '/api/leaderboards/',
		      type: 'GET',
		      contentType: 'application/json',
		      dataType: 'json',
		      crossDomain: true,
		      xhrFields: {
		          withCredentials: true
		      },
		      success: function(data){
                console.log("SUCCESS WITH LEADERBOARDS AJAX CALL");
                console.log(data);
                
                self.collection.add(data, {merge: true});
                var template_json = self.collection.toJSON();
                var html = self.template(template_json);
                self.$el.html(html);
                
		      },
		      error: function(data){
		        console.log("ERROR ON GETUSERSTATISTICS"); 
		      },
		      complete: function(){
		        self.$el.find("#leaderboardsTable").DataTable({
		          "sPaginationType": "full_numbers",
		          "bSort": false,
		          "iDisplayLength": 10,
		          "bLengthChange": false //used to hide the property  
		        });
		      }
		  	});  
			}

    });
});