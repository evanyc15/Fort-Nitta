/* RequireJS Module Dependency Definitions */
define([
	'app',
	'marionette',
	'handlebars',
    'models/SignupModel',
	'text!templates/home_signupBox.html',
    'backbone.validation'
], function (App, Marionette, Handlebars, SignupModel, template){

	"use strict";

	return Marionette.ItemView.extend({
		//Template HTML string
        template: Handlebars.compile(template),
        model: new SignupModel(),

		initialize: function(options){
			this.options = options;
            var self = this;

            Backbone.Validation.bind(this, {
              model: this.model
            });
            this.model.bind('validated:valid', function(model) {
                App.session.signup({
                    data: model.toJSON()
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
            });
            this.model.bind('validated:invalid', function(model, errors) {
                // console.log(errors);
                Object.keys(errors).forEach(function(k) {
                    console.log("input[name='"+k+"']");
                    self.$el.find("input[name='"+k+"']").addClass('error').attr("placeholder",errors[k]);
                });
            });
		},
		events: {
			"click #backLoginButton": "loginShow",
			"click #signupSubmitButton": "signup",
            "keyup #repasswordInput": "rePasswordKeyup"
		},
		loginShow: function(){
			this.trigger("click:login:show");
		},
        // Takes care of the enter key for signup
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
            this.model.set({
                'first_name': this.$("#firstnameInput").val(),
                'last_name': this.$("#lastnameInput").val(),
                'username': this.$("#usernameInput").val(),
                'email': this.$("#emailInput").val(),
                'password': this.$("#passwordInput").val(),
                'repassword': this.$("#repasswordInput").val()
            }).validate();
		},
        showError: function(string){
            $(string).addClass("show");
            setTimeout(function() {
                $(string).removeClass("show");
            }, 5000);
        }
	});
});