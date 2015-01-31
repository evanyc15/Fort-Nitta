define([
    'App',
    'jquery',
    'marionette',
    'handlebars',
    'text!templates/home_changePasswordBox.html'
], function (App, $, Marionette, Handlebars, template){

    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),

        initialize: function(options){
            this.options = options;

            this.urlParams = {}
        },
        events: {
           "click #backLoginButton": "loginShow",
           "click #passwordButton": "changePassword"
        },
        loginShow: function() {
            this.trigger("click:login:show");
        },
        changePassword: function(event) {
            var self = this;
            if(this.$("#passwordInput").val() !== this.$("#repasswordInput").val()){
                $("#repasswordError").addClass("show");
                setTimeout(function() {
                    $("#repasswordError").removeClass("show");
                }, 5000);
            } else{
                var password = this.$("#passwordInput").val();
                this.urlParams["password"] = password;
                if(this.options.id !== "" && this.options.id){
                    var vars = String(this.options.id).replace('?','').split('&');
                    for (var i = 0; i < vars.length; i++) {
                        var pair = vars[i].split('=');
                        this.urlParams[pair[0]] = pair[1];
                    }
                }
                $.ajax({
                    url: '/api/users/changepass/',
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
                            $("#passwordSuccess").addClass("show");
                            setTimeout(function() {
                                $("#passwordSuccess").removeClass("show");
                                self.trigger("click:login:show");
                            }, 3000);
                        } else{
                            $("#passwordError").addClass("show");
                            setTimeout(function() {
                                $("#passwordError").removeClass("show");
                            }, 3000);
                        }
                    },
                    error: function(){
                        $("#passwordError").addClass("show");
                        setTimeout(function() {
                            $("#passwordError").removeClass("show");
                        }, 3000);
                    }
                });            
            }
        }
     
    });
});