define([
	'App',
	'marionette',
	'handlebars',
	'text!templates/main_profile.html',
	'moment'
], function (App, Marionette, Handlebars, template){
	"use strict";

	return Marionette.ItemView.extend({
		//Template HTML string
        template: Handlebars.compile(template),

		initialize: function(options){
			this.options = options;
		},
		events: {
			"mouseenter #profilePicture,#profilePictureChange": "changeProfilePictureShow",
			"mouseleave #profilePicture,#profilePictureChange": "changeProfilePictureHide",
			"click #profilePictureChange": "changeProfilePicture",
			"change #profilePictureChangeInput": "saveFile"
		},
		onRender: function(){
			var html = this.template(App.session.user.toJSON());
			this.$el.html(html);
		},
		onShow: function() {
			//console.log(moment(App.session.user.date_joined).format("ddd, YYYY MMM Do")); 
			if(App.session.user.attributes.avatar_path && App.session.user.attributes.avatar_path != ""){
				this.$el.find("#profilePicture").attr('src','/api/avatar/'+App.session.user.attributes.avatar_path);
			}
			$("#username").html(App.session.user.attributes.username);
			this.$el.find("#profileTable").DataTable();
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
		}
	
	});
});