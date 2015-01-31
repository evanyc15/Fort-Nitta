define([
	'App',
	'jquery',
	'marionette',
	'handlebars',
	'text!templates/main_topbar.html'
], function (App, $, Marionette, Handlebars, template){

	"use strict";

	return Marionette.ItemView.extend({
		//Template HTML string
        template: Handlebars.compile(template),

		initialize: function(options){
			this.options = options;	
		},
		events: {
			"click #logoutButton": "logout",
			"click #topbarSettings": "settings",
			"click #topBarMyProfile": "myprofile"
		},
		onRender: function(){
			var html = this.template(App.session.user.toJSON());
			this.$el.html(html);
		},
		settings: function(){
			this.trigger("click:settings:show");
		},
		myprofile: function() {
			this.trigger("click:myprofile:show");
		},
		logout: function(event) {
			event.stopPropagation();
      		event.preventDefault();

			App.session.logout({
			},{
				success: function(){
					console.log("Logged out");
					App.session.trigger("change:logged_out");
				},
				error: function() {
					console.log("Logged out failed");
				}
			});
		}
		
	});
});