define([
	'App',
	'jquery',
	'marionette',
	'handlebars',
	'text!templates/home_loginBox.html'
], function (App, $, Marionette, Handlebars, template){

	"use strict";

	return Marionette.ItemView.extend({
		//Template HTML string
        template: Handlebars.compile(template),

		initialize: function(options){
			this.options = options;
		},
		events: {
			"click #signupButton": "signUpShow",
			"click #loginButton": "login",
            "click #forgotPasswordA": "forgotPassword",
            "keyup #passwordInput": "onPasswordKeyup"
		},
		signUpShow: function(){
			this.trigger("click:signup:show");
		},
        onPasswordKeyup: function(event){
            var k = event.keyCode || event.which;

            if (k == 13 && $("#passwordInput").val() === ''){
                event.preventDefault();    // prevent enter-press submit when input is empty
            } else if(k == 13){
                event.preventDefault();
                this.login();
                return false;
            }
        },
		login:function (event){
            if(event){
                event.stopPropagation();
                event.preventDefault();
            }   
      		App.session.login({
                username: this.$("#usernameInput").val(),
                password: this.$("#passwordInput").val()
            }, {
                success: function(mod, res){
                    Backbone.history.navigate('main', {trigger: true});
                },
                error: function(err){
                    $("small.error").addClass("show");
                    setTimeout(function() {
					  $("small.error").removeClass("show");
					}, 5000);
                }
            });
	    },
        forgotPassword: function() {
            this.trigger("click:forgotPassword:show");
        }
	});
});