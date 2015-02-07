/* RequireJS Module Dependency Definitions */
define([
	'app',
	'marionette',
	'handlebars',
	'text!templates/home_signupBox.html'
], function (App, Marionette, Handlebars, template){

	"use strict";

	return Marionette.ItemView.extend({
		//Template HTML string
        template: Handlebars.compile(template),

		initialize: function(options){
			this.options = options;
		},
		events: {
			"click #backLoginButton": "loginShow",
			"click #signupSubmitButton": "signup",
            "keyup #repasswordInput": "rePasswordKeyup"
		},
		loginShow: function(){
			this.trigger("click:login:show");
		},
        rePasswordKeyup: function(event) {
            var k = event.keyCode || event.which;

            if (k == 13 && $('#repasswordInput').val() === ''){
                event.preventDefault();   // prevent enter-press submit when input is empty
            } else if(k == 13){
                event.preventDefault();
                this.signup();
                return false;
            }
        },
		signup: function(event) {
            var flag = true;
            var reEmail = /\S+@\S+\.\S+/;
			var reUsername = /[;|,|\/|\\]+/;

            if(event){
                event.stopPropagation();
                event.preventDefault();
            }   
            if(this.$("#passwordInput").val() !== this.$("#repasswordInput").val()){
                this.showError("small#repasswordError.error");
                flag = false;
            } 
            if(this.$("#firstnameInput").val() === ""){
                this.showError("small#firstnameError.error");
                flag = false;
            }
            if(this.$("#lastnameInput").val() === ""){
                this.showError("small#lastnameError.error");
                flag = false;
            }
            if((this.$("#usernameInput").val() === "")|| (reUsername.test(this.$("#usernameInput").val()))){
                this.showError("small#usernameError.error");
                flag=false;
            }
    
            if(!reEmail.test(this.$("#emailInput").val())){
                this.showError("small#emailError.error");
                flag = false;
            }
            if(flag){
                var self = this;
                App.session.signup({
                    username: this.$("#usernameInput").val(),
                    password: this.$("#passwordInput").val(),
                    email: this.$("#emailInput").val(),
                    first_name: this.$("#firstnameInput").val(),
                    last_name: this.$("#lastnameInput").val(),
                }, {
                    success: function(mod, res){
                        // console.log("SUCCESS", mod, res);
                        console.log("SUCCESS");
                        Backbone.history.navigate('main', {trigger: true});
                    },
                    error: function(err){
                        console.log("ERROR", err);
                        self.showError("small#passwordError.error");
                    }
                });
            }
		},
        showError: function(string){
            $(string).addClass("show");
            setTimeout(function() {
                $(string).removeClass("show");
            }, 5000);
        }
	});
});