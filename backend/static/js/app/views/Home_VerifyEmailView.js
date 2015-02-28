/* RequireJS Module Dependency Definitions */
define([
    'app',
    'jquery',
    'marionette',
    'handlebars',
    'text!templates/home_verifyemail.html',
    'text!templates/home_verifiedemail.html'
], function (App, $, Marionette, Handlebars, templateVerify, templateVerified){

    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string

        initialize: function(options){
            this.options = options;
            if(!this.options.id || this.options.id === 'undefined' || this.options.id === "" || this.options.id === "null"){
                this.template = Handlebars.compile(templateVerify);
            } else{
                this.template = Handlebars.compile(templateVerified);
            }
        },
        events: {
            "click #backLoginButton": "backtoLogin",
            "keyup #emailInput": "emailKeyup",
            "click #sendEmailButton": "sendEmail"
        },
        onRender: function(){
            this.urlParams = {}

            // Checks the url (passed in from controller), if there are GET parameters, then it sends the ajax call to verify user
            if(this.options.id && this.options.id !== 'undefined' && this.options.id !== "" && this.options.id !== "null") {
                var self = this;
                this.template = Handlebars.compile(templateVerified);
                if(this.options.id !== "" && this.options.id){
                    var vars = String(this.options.id).replace('?','').split('&');
                    for (var i = 0; i < vars.length; i++) {
                        var pair = vars[i].split('=');
                        this.urlParams[pair[0]] = pair[1];
                    }
                }
                $.ajax({
                    url: '/api/users/verifyuser/',
                    type: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify(this.urlParams),
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data){
                        if(data.success){
                            $("#verifySuccess").css("display","block");
                            setTimeout(function() {
                                $("#verifySuccess").css("display","none");
                                self.trigger("click:login:show");
                            }, 3000);
                        } else{
                            $("#verifyError").css("display","block");
                            setTimeout(function() {
                                $("#verifyError").css("display","none");
                                self.trigger("click:login:show");
                            }, 3000);
                        }
                    },
                    error: function(){
                        $("#verifyError").css("display","block");
                        setTimeout(function() {
                            $("#verifyError").css("display","none");
                            self.trigger("click:login:show");
                        }, 3000);    
                    },
                });            
            }
        },
        onBeforeDestroy: function(){
            // Need to unbind events to prevent memory leaks
            this.unbind();
        },
        backtoLogin: function() {
            this.trigger("click:login:show");
        },
        emailKeyup: function(event){
            var k = event.keyCode || event.which;

            if (k == 13 && $("#emailInput").val() === ""){
                event.preventDefault();    // prevent enter-press submit when input is empty
            } else if(k == 13){
                event.preventDefault();
                this.sendEmail();
                return false;
            }
        },
        // This sends the email to verify user
        sendEmail: function(event) {
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
                }, 5000);
            } else{
                $.ajax({
                    url: '/api/veremailacc/',
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
                            $("#emailSuccess").css("display","block");
                            setTimeout(function() {
                                $("#emailSuccess").css("display","none");
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