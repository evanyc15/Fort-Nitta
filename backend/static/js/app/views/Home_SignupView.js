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
                        console.log("SUCCESS");
                        self.model.clear();
                        Backbone.history.navigate('main', {trigger: true});
                    },
                    error: function(err){
                        console.log("ERROR", err);
                    }
                });
            });
            this.model.bind('validated:invalid', function(model, errors) {
                Object.keys(errors).forEach(function(k) {
                    var htmlElement = self.$el.find("input[name='"+k+"']");
                    var placeholder = htmlElement.attr("placeholder");

                    htmlElement.val("");
                    htmlElement.addClass("error").attr("placeholder",errors[k]);
                    setTimeout(function() {
                        htmlElement.removeClass("error").attr("placeholder",placeholder);
                    }, 3000);
                });
            });
		},
		events: {
			"click #backLoginButton": "loginShow",
			"click #signupSubmitButton": "signup",
            "keyup #repasswordInput": "rePasswordKeyup"
		},
        onBeforeDestroy: function(){
            // Need to unbind events to prevent model validation from occuring multiple times when re-entering this view
            // If we do not unbind, there will be multiple bindings of the same event on the same object which causes it to
            // fire multiple times.
            Backbone.Validation.unbind(this, {model: this.model});
            this.model.unbind();
            this.unbind();
        },
		loginShow: function(){
			this.trigger("click:login:show");
		},
        // Takes care of the enter key for signup
        rePasswordKeyup: function(event) {
            var k = event.keyCode || event.which;

            if (k == 13 && $("#repasswordInput").val() === ""){
                event.preventDefault();   // prevent enter-press submit when input is empty
            } else if(k == 13){
                event.preventDefault();
                this.signup();
                return false;
            }
        },
		signup: function(event) {
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
		}
	});
});