/* RequireJS Module Dependency Definitions */
define([
	'app',
	'marionette',
	'handlebars',
	'text!templates/main_profile.html',
	'collections/GameInfoCollection',
	'moment'
], function (App, Marionette, Handlebars, template, GameInfoCollection){
	"use strict";

	return Marionette.ItemView.extend({
		//Template HTML string
    template: Handlebars.compile(template),
    collection: new GameInfoCollection(),

		initialize: function(options){
			this.options = options;

	      	// Reset collection because it is saved when using the "back" button which causes bugs
	      	this.collection.reset();

	      	// This is to create a helper for the template
	      	Handlebars.registerHelper('ifevenodd', function (id, options) { 
				if(id % 2){
              		return options.inverse(this);
	          	} else {  
              		return options.fn(this);
	          	}
	      	});

	      	Handlebars.registerHelper('ifwinner', function (id, winner_id, options) {
	      		if(id === winner_id) {
	      			return options.fn(this);
	      		}
	      		return options.inverse(this);
	      	});
		},
		events: {
			"mouseenter #profilePicture,#profilePictureChange": "changeProfilePictureShow",
			"mouseleave #profilePicture,#profilePictureChange": "changeProfilePictureHide",
			"click #profilePictureChange": "changeProfilePicture",
			"change #profilePictureChangeInput": "saveFile"
		},
		onRender: function(){

			this.getUserStatistics();
			this.getGameInfo();

			var html = this.template({
				'user_info': {
					"username": App.session.user.get('username'),
					"email": App.session.user.get('email'),
					"date_joined": moment(App.session.user.get('date_joined')).format("ddd, YYYY MMM Do")
				}
			});
			this.$el.html(html);
		},
		onShow: function() {
			//console.log(moment(App.session.user.date_joined).format("ddd, YYYY MMM Do")); 
			if(App.session.user.attributes.avatar_path && App.session.user.attributes.avatar_path != ""){
				this.$el.find("#profilePicture").attr('src','/api/avatar/'+App.session.user.attributes.avatar_path);
			}
			$("#username").html(App.session.user.attributes.username);
		},
		changeProfilePictureShow: function() {
			$("#profilePictureChange").show();
		},
		changeProfilePictureHide: function() {
			$("#profilePictureChange").hide();
		},
		changeProfilePicture: function() {
			$("#profilePictureChangeInput").click();
		},
		saveFile: function() {
			var picture = $('input[name="imageInput"]')[0].files[0]; 
			var data = new FormData();
			data.append('file', picture);
			$.ajax({
				url: '/api/avatar/',
				type: 'POST',
				data: data,
				cache: false,
				contentType: false,
				processData: false,
				crossDomain: true,
				xhrFields: {
					withCredentials: true
				},
				success: function(data){
					$("#profilePicture").attr('src','/api/avatar/'+ data.user.avatar_path)
				},
				error: function(data){
					alert('no upload');
					$('#loadingModal').modal('hide');
				}
	  		});
			},
			getGameInfo: function() {
				var self = this;
		    $.ajax({
		      url: '/api/game_info/?id='+App.session.attributes.user_id,
		      type: 'GET',
		      contentType: 'application/json',
		      dataType: 'json',
		      crossDomain: true,
		      xhrFields: {
		          withCredentials: true
		      },
		      success: function(data){
		          self.collection.add(data, {merge: true});
							var template_json = self.collection.toJSON();
							template_json['user_info'] = {
								"username": App.session.user.get('username'),
								"email": App.session.user.get('email'),
								"date_joined": moment(App.session.user.get('date_joined')).format("ddd, YYYY MMM Do")
							};
		          var html = self.template(template_json);
		          self.$el.html(html);
		      },
		      error: function(data){
		         
		      },
		      complete: function(){
		        self.$el.find("#profileTable").DataTable({
		          "sPaginationType": "full_numbers",
		          "bSort": false,
		          "iDisplayLength": 10,
		          "bLengthChange": false //used to hide the property  
		        });
		      }
		  	});  
			},
			getUserStatistics: function() {
				$.ajax({
					url: '/api/user_statistics/',
					type: 'GET',
					cache: false,
					contentType: false,
					processData: false,
					crossDomain: true,
					xhrFields: {
						withCredentials: true
					},
					success: function(data){
	          if(!data.user_statistics.win_loss_ratio || data.user_statistics.win_loss_ratio == '')
	            $("#win_loss_ratio").html("You haven't played any games yet!");
	          else {
	            $("#win_loss_ratio").html(data.user_statistics.win_loss_ratio);
	            $("#win_loss_ratio_meter").css('width', (100*data.user_statistics.win_loss_ratio)+'%')
	          }
					},
					error: function(data){
						$("#win_loss_ratio").html("You haven't played any games yet!");
					}				
				});
			}
	});
});