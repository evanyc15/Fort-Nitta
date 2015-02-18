/* RequireJS Module Dependency Definitions */
define([
    'app',
    'marionette',
    'handlebars',
    'models/SettingsModel',
    'text!templates/main_settingschange.html'
], function (App, Marionette, Handlebars, SettingsModel, template){
    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),
        model: new SettingsModel(),

        initialize: function(options){
            this.options = options;
            var self = this;

            Backbone.Validation.bind(this, {
                model: this.model
            });
            this.model.bind('validated:valid', function(model) {
                if(self.$("#profilePictureChangeInput").val() !== "" && self.$("#profilePictureChangeInput").val() !== null){    
                    var picture = $('input[name="imageInput"]')[0].files[0];
                    var data = new FormData(); 
                    data.append('file', picture);
                    $.ajax({
                        url: '/api/avatar/',
                        type: 'POST',
                        data: data,
                        cache: false,
                        contentType: false,
                        processData: false,
                        crossDomain: true,
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function(data){
                            $("#profilePicture").attr('src','/api/avatar/'+ data.user.avatar_path)
                            App.session.user.set(_.pick(data.user, _.keys(App.session.user.defaults)));
                        },
                        error: function(data){
                            //alert('no upload');
                            $('#loadingModal').modal('hide');
                        }
                    });            
                }
               App.session.changeDetails({
                    data: model.toJSON()         
                }, 
                {
                    success: function(data){
                        App.session.user.set(_.pick(data, _.keys(App.session.user.defaults)));

                        Backbone.history.navigate('main', {trigger: true});
                    },       
                    error: function(data){
                        var htmlElement = self.$el.find("input[name='"+data.responseJSON.offending_attribute+"']");
                        var placeholder = htmlElement.attr("placeholder");

                        htmlElement.val("");
                        htmlElement.addClass("error").attr("placeholder",data.responseJSON.error);
                        setTimeout(function() {
                            htmlElement.removeClass("error").attr("placeholder",placeholder);
                        }, 3000);
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
                self.model.clear();
            });
        },
        events: {
		    "click #profilePictureChange": "changeProfilePicture",
            "click #settingsSubmitButton": "changeDetails",
		    "click #settingsCancelButton": "cancel"   
        },
        onRender: function() {
            var html = this.template(App.session.user.toJSON());
            this.$el.html(html);
        },
        onShow: function() {
            if(App.session.user.get("avatar_path") && App.session.user.get("avatar_path") != ""){
                this.$el.find("#profilePicture").attr('src','/api/avatar/'+App.session.user.get("avatar_path"));
            }
        },
        changeProfilePicture: function() {
            $("#profilePictureChangeInput").click();
        },
		changeDetails: function(event){
			var self = this;

            var firstnameElement = self.$("#firstnameInput");
            var lastnameElement = self.$("#lastnameInput");
            var emailElement = self.$("#emailInput");
            var oldpasswordElement = self.$("#oldpasswordInput");
            var passwordElement = self.$("#passwordInput");
            var repasswordElement = self.$("#repasswordInput");
            var firstname, lastname, email, oldpassword, password, repassword;
            
            this.model.set({'username': App.session.user.get('username')});
            if(firstnameElement.val() != "" || lastnameElement.val() != "" || emailElement.val() != "" || 
                oldpasswordElement.val() != "" || passwordElement != "" || repasswordElement != ""){

                if(firstnameElement.val() != "") {
                    this.model.set({'first_name': firstnameElement.val()}); 
                }
                if(lastnameElement.val() != ""){
                    this.model.set({'last_name': lastnameElement.val()});
                } 
                if(emailElement.val() != ""){
                    this.model.set({'email': emailElement.val()});
                } 
                if(oldpasswordElement.val() != ""){
                    this.model.set({'oldpassword': oldpasswordElement.val()});
                } else {
                    this.model.set({'oldpassword': App.session.user.get('password')})
                }
                if(passwordElement.val() != ""){
                    this.model.set({'password': passwordElement.val()}); 
                }
                if(repasswordElement.val() != ""){
                    this.model.set({'repassword': repasswordElement.val()});
                }
                
                this.model.validate();
            }
    	},
		cancel: function(event){
		    console.log("Cancel button invoked");
			Backbone.history.navigate('main', {trigger: true}); 
		}
		
		
    });
});
