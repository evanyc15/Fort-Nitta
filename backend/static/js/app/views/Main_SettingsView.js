define([
    'app',
    'marionette',
    'handlebars',
    'text!templates/main_settings.html'
], function (App, Marionette, Handlebars, template){
    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),

        initialize: function(options){
            this.options = options;
        },
        events: {
		    "click #profilePictureChange": "changeProfilePicture",
            "change #profilePictureChangeInput": "saveFile",
            "click #settingsSubmitButton": "changeDetails",
		    "click #settingsCancelButton": "cancel"   
        },
		onShow: function() {
            //console.log(moment(App.session.user.date_joined).format("ddd, YYYY MMM Do")); 
			if(App.session.user.attributes.firstname!= ""){
			    this.$el.find("#firstnameInput").attr('placeholder', App.session.user.attributes.firstname);
			}
			if(App.session.user.attributes.lastname!= ""){
			    this.$el.find("#lastnameInput").attr('placeholder', App.session.user.attributes.lastname);
			}
			if(App.session.user.attributes.email!= ""){
			    this.$el.find("#emailInput").attr('placeholder', App.session.user.attributes.email);
			}
            if(App.session.user.attributes.avatar_path && App.session.user.attributes.avatar_path != ""){
                this.$el.find("#profilePicture").attr('src','/api/avatar/'+App.session.user.attributes.avatar_path);
            }
        },
        changeProfilePicture: function() {
            $("#profilePictureChangeInput").click();
        },
        saveFile: function() {
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
                },
                error: function(data){
                    alert('no upload');
                    $('#loadingModal').modal('hide');
                }
            });
        },
		changeDetails: function(event){
				var self = this;
				if(self.$("#passwordInputOld").val() !== ""){
					
				    if(self.$("#passwordInput").val() === self.$("#repasswordInput").val()){					
					App.session.login({ 
						username: App.session.user.get("username"),
						password: self.$("#passwordInputOld").val()
					},				
					{
				        success: function(mod, res){
						console.log("Old Password matched");
						App.session.changeDetails({
						username: App.session.user.get("username"),
						password: self.$("#passwordInput").val(),
						first_name: self.$("#firstnameInput").val(),
						last_name: self.$("#lastnameInput").val(),
						email: self.$("#emailInput").val()				
					}, 
					{
						success: function(mod, res){
						console.log("SUCCESS-changeDetails");
						Backbone.history.navigate('main', {trigger: true});
						}
 
					});
						
						},
						error: function(err){
							console.log("Old password does not match!");
						}
					});
					}
						else {
							console.log("New passwords don't match!");
							self.showError("small#repasswordError.error"); 
						}
				}
				else if (self.$("#passwordInput").val() == ""){
						App.session.changeDetails({
						username: App.session.user.get("username"),
						password: self.$("#passwordInput").val(),
						first_name: self.$("#firstnameInput").val(),
						last_name: self.$("#lastnameInput").val(),
						email: self.$("#emailInput").val()				
					}, 
					{
						success: function(mod, res){
						console.log("SUCCESS-changeDetails");
						Backbone.history.navigate('main', {trigger: true});
						}
 
					});
					}
			
	

	},
	showError: function(string){
            $(string).addClass("show");
            setTimeout(function() {
                $(string).removeClass("show");
            }, 5000);
        },
		
		cancel: function(event){
		    console.log("Cancel button invoked");
			Backbone.history.navigate('main', {trigger: true}); 
		}
		
		
    });
});