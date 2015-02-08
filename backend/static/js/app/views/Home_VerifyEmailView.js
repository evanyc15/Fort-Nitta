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
            this.urlParams = {}

            // Checks the url (passed in from controller), if there are GET parameters, then it sends the ajax call to verify user
            if(!this.options.id || this.options.id === 'undefined' || this.options.id === "" || this.options.id === "null"){
                this.template = Handlebars.compile(templateVerify);
            } else {
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
                            $("#verifySuccess").addClass("show");
                            setTimeout(function() {
                                $("#verifySuccess").removeClass("show");
                                self.trigger("click:login:show");
                            }, 3000);
                        } else{
                            $("#verifyError").addClass("show");
                            setTimeout(function() {
                                $("#verifyError").removeClass("show");
                                self.template = Handlebars.compile(templateVerify);
                            }, 3000);
                        }
                    },
                    error: function(){
                        $("#verifyError").addClass("show");
                        setTimeout(function() {
                            $("#verifyError").removeClass("show");
                            self.template = Handlebars.compile(templateVerify);
                        }, 3000);
                    }
                });            
            }
        },
        events: {
            "click #backLoginButton": "backtoLogin",
            "click #sendEmailButton": "sendEmail"
        },
        backtoLogin: function() {
            this.trigger("click:login:show");
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
                        console.log(data);
                        if(data.success){
                            $("#emailSuccess").addClass("show");
                            setTimeout(function() {
                                $("#emailSuccess").removeClass("show");
                            }, 3000);
                        } else {
                            $("#emailError").addClass("show");
                            setTimeout(function() {
                                $("#emailError").removeClass("show");
                            }, 3000);
                        }
                    },
                    error: function(){
                        $("#emailError").addClass("show");
                        setTimeout(function() {
                            $("#emailError").removeClass("show");
                        }, 5000);
                    }
                });
            } 
        }
    });
});