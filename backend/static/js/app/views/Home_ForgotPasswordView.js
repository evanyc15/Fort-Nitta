/* RequireJS Module Dependency Definitions */
define([
    'app',
    'jquery',
    'marionette',
    'handlebars',
    'text!templates/home_forgotPasswordBox.html'
], function (App, $, Marionette, Handlebars, template){

    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),

        initialize: function(options){
            this.options = options;
        },
        events: {
           "click #backLoginButton": "loginShow",
           "keyup #emailInput": "emailKeyup",
           "click #passwordRecButton": "passwordRecovery"
        },
        onBeforeDestroy: function(){
            // Need to unbind events to prevent memory leaks
            this.unbind();
        },
        loginShow: function() {
            this.triggerMethod("click:login:show");
        },
        emailKeyup: function(event){
             var k = event.keyCode || event.which;

            if (k == 13 && $("#emailInput").val() === ""){
                event.preventDefault();   // prevent enter-press submit when input is empty
            } else if(k == 13){
                event.preventDefault();
                this.passwordRecovery();
                return false;
            }
        },
        // This sends the email to the user for reset their password
        passwordRecovery: function(event) {
            var self = this;

            if(event){
                event.stopPropagation();
                event.preventDefault();
            }  
            var email = $("#emailInput").val();
            if(email === ""){
                $("#emailError").addClass("show");
                setTimeout(function() {
                    $("#emailError").removeClass("show");
                }, 3000);
            } else{
                $.ajax({
                    url: '/api/recpassmail/',
                    type: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({'email': email}),
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data){
                        if(data.success){
                            self.$("#emailSuccess").show();
                            setTimeout(function() {
                                self.$("#emailSuccess").hide();
                            }, 3000);
                        } else {
                            var emailElement = self.$("input[name='email']");
                            var placeholder = emailElement.attr("placeholder");

                            emailElement.val("");
                            emailElement.addClass("error").attr("placeholder", "Please enter a valid email");
                            setTimeout(function() {
                                emailElement.removeClass("error").attr("placeholder", placeholder);
                            }, 3000);
                        }
                    },
                    error: function(){
                        var emailElement = self.$("input[name='email']");
                        var placeholder = emailElement.attr("placeholder");

                        emailElement.val("");
                        emailElement.addClass("error").attr("placeholder", "Please enter a valid email");
                        setTimeout(function() {
                            emailElement.removeClass("error").attr("placeholder", placeholder);
                        }, 3000);
                    }
                });
            } 
        }
    });
});