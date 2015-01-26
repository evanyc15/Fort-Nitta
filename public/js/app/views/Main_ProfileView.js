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
			"click #profilePictureChange": "changeProfilePicture"
		},
		changeProfilePictureShow: function() {
			$("#profilePictureChange").show();
		},
		changeProfilePictureHide: function() {
			$("#profilePictureChange").hide();
		},
		changeProfilePicture: function() {
			$("#profilePictureChangeInput").click();
		}
	});
});