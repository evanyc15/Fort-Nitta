define([
	"app",
	"marionette",
	"backbone",
	"underscore",
	"jquery",
	"js/apps/home/layout/home_layout"
], function (App, Marionette, Backbone, _, $, Layout){
	return Backbone.Marionette.Controller.extend({

		initialize: function(options){
			this.options = options;

			var home_Layout = new Layout();
			Layout.render();
		}

	});
});


// App.module("HomeApp.Home", function(Home, App, Backbone, Marionette, $, _){
// 	Home.Controller = {
// 		showLoginBox: function(){
// 			var loginView = new Home.loginBox();
			
// 			App.loginRegion.show(loginView);
// 		}


// 		init: function(){
// 			var home_Layout = new Home.homeLayout();
			
// 			home_Layout.render();
// 		}
// 	}
// });