/* RequireJS Module Dependency Definitions */
define([
    'app',
    'jquery',
    'marionette',
    'handlebars',
    'models/ChangePasswordModel',
    'text!templates/home_changePasswordBox.html'
], function (App, $, Marionette, Handlebars, ChangePasswordModel, template){

    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),
        model: new ChangePasswordModel(),

        initialize: function(options){
            this.options = options;
            var self = this;

            this.urlParams = {}
            Backbone.Validation.bind(this, {
                model: this.model
            });
            this.model.bind('validated:valid', function(model) {
                self.urlParams["password"] = self.model.get("password");
                if(self.options.id !== "" && self.options.id){
                    var vars = String(self.options.id).replace('?','').split('&');
                    for (var i = 0; i < vars.length; i++) {
                        var pair = vars[i].split('=');
                        self.urlParams[pair[0]] = pair[1];
                    }
                }
                $.ajax({
                    url: '/api/users/changepass/',
                    type: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify(self.urlParams),
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data){
                        if(data.success){
                            $("#passwordSuccess").css("display","block");
                            setTimeout(function() {
                                $("#passwordSuccess").css("display","none");
                                self.trigger("click:login:show");
                            }, 3000);
                        } else{
                            Object.keys(errors).forEach(function(k) {
                                var htmlElement = self.$el.find("input[name='"+k+"']");
                                var placeholder = htmlElement.attr("placeholder");

                                htmlElement.val("");
                                htmlElement.addClass("error").attr("placeholder",errors[k]);
                                setTimeout(function() {
                                    htmlElement.removeClass("error").attr("placeholder",placeholder);
                                }, 3000);
                            });
                        }
                    },
                    error: function(){
                         Object.keys(errors).forEach(function(k) {
                            var htmlElement = self.$el.find("input[name='"+k+"']");
                            var placeholder = htmlElement.attr("placeholder");

                            htmlElement.val("");
                            htmlElement.addClass("error").attr("placeholder",errors[k]);
                            setTimeout(function() {
                                htmlElement.removeClass("error").attr("placeholder",placeholder);
                            }, 3000);
                        });
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
           "click #passwordButton": "changePassword"
        },
        onBeforeDestroy: function(){
            // Need to unbind events to prevent model validation from occuring multiple times when re-entering this view
            // If we do not unbind, there will be multiple bindings of the same event on the same object which causes it to
            // fire multiple times.
            Backbone.Validation.unbind(this, {model: this.model});
            this.model.unbind();
            this.unbind();
        },
        loginShow: function() {
            this.trigger("click:login:show");
        },
        // This is for changing the password, this submits the new passwords for changing the user's password via ajax call
        changePassword: function(event) {
            var self = this;

            if(event){
                event.stopPropagation();
                event.preventDefault();
            }   
            this.model.set({
                'password': this.$("#passwordInput").val(),
                'repassword': this.$("#repasswordInput").val()
            }).validate();
        }
     
    });
});