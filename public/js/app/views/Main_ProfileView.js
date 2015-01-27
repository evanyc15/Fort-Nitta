define([
	'app',
	'marionette',
	'handlebars',
	'text!templates/main_profile.html'
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
				url: 'http://localhost:5000/api/avatar/',
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
					$("#profilePicture").attr('src','http://localhost:5000/api/avatar/'+ data.username)
				},
				error: function(data){
					alert('no upload');
					$('#loadingModal').modal('hide');
				}
	  		});
		},
	});
});