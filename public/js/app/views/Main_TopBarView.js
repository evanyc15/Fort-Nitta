define([
	'App',
	'marionette',
	'handlebars',
	'text!templates/main_topbar.html'
], function (App, Marionette, Handlebars, template){

	"use strict";

	return Marionette.ItemView.extend({
		//Template HTML string
        template: Handlebars.compile(template),

		initialize: function(options){
			this.options = options;
		},
		events: {
			"click #signupButton": "logout",
		},
		logout: function() {
			App.session.trigger("change:logged_out");
		}
		
	});
});