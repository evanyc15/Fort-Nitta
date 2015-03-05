/* RequireJS Module Dependency Definitions */
define([
    'app',
    'marionette',
    'handlebars',
    'text!templates/main_adminglobalannouncementsposts-create.html'
], function (App, Marionette, Handlebars, template){
    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),

        initialize: function(options){
            this.options = options;
        },
        events: {
            "click #globalannouncementspost-buttonCancel": "cancelButton",
            "click #globalannouncementspost-buttonSubmit": "submitButton"
        },
        onShow: function(){

        },
        onBeforeDestroy: function(){
            // Need to unbind events to prevent model validation from occuring multiple times when re-entering this view
            // If we do not unbind, there will be multiple bindings of the same event on the same object which causes it to
            // fire multiple times.
            // Backbone.Validation.unbind(this, {model: this.model});
            // this.model.unbind();
        },
        cancelButton: function() {
            this.triggerMethod("click:globalannouncementsposts:show", {model: this.options.model});
        },
        submitButton: function(event) {
            var self = this;
            if(event){
                event.stopPropagation();
                event.preventDefault();
            }
            var message = this.$("#globalannouncementspostmessage").val();
            $.ajax({
                url: '/api/admin/announcementposts/',
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({'message': message,'announcement_id': self.options.model.get('id')}),
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function(data){
                    self.triggerMethod("click:globalannouncementposts:show", {model: self.options.model});
                },
                error: function(){
                    var htmlElement = self.$el.find("textarea[name='message']");
                    var placeholder = htmlElement.attr("placeholder");

                    htmlElement.val("");
                    htmlElement.addClass("error").attr("placeholder","Creating new Announcement Post failed");
                    setTimeout(function() {
                        htmlElement.removeClass("error").attr("placeholder",placeholder);
                    }, 3000);
                    
                    self.model.clear();
                }
            });
        }
    });
});
