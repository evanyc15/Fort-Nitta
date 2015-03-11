/* RequireJS Module Dependency Definitions */
define([
    'app',
    'marionette',
    'handlebars',
    'text!templates/main_adminglobalannouncements.html',
    'collections/AdminGlobalAnnouncementsCollection'
], function (App, Marionette, Handlebars, template, AdminGlobalAnnouncementsCollection){
    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),
        collection: new AdminGlobalAnnouncementsCollection(),

        initialize: function(options){
            this.options = options;
        },
        events: {
            "click #createglobalannouncement": "createglobalannouncement",
            "click .announcementButton": "globalannouncementPostshow"
        },
        onRender: function() {
            var self = this;

            $.ajax({
                url: '/api/admin/announcements/',
                type: 'GET',
                contentType: 'application/json',
                dataType: 'json',
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function(data){

                    self.collection.add(data, {merge: true});

                    var html = self.template(self.collection.toJSON());
                    self.$el.html(html);        
                },
                error: function(data){
                   
                },
                complete: function(){
                    self.$el.find("#globalAnnouncementsTable").DataTable({
                        "sPaginationType": "full_numbers",
                        "bSort": false,
                        "iDisplayLength": 10,
                        "bLengthChange": false //used to hide the property  
                    });
                }
            }); 
        },
        onBeforeDestroy: function(){
            // Need to unbind events to prevent model validation from occuring multiple times when re-entering this view
            // If we do not unbind, there will be multiple bindings of the same event on the same object which causes it to
            // fire multiple times.
            // Backbone.Validation.unbind(this, {model: this.model});
            // this.model.unbind();
        },
        createglobalannouncement: function() {
            this.triggerMethod("click:newglobalannouncement:show");
        },
        globalannouncementPostshow: function(event){
            var selector = $(event.target);
            if(!selector.hasClass("announcementButton")){
                selector = $(event.target).closest(".announcementButton");
            }
            this.triggerMethod("click:globalannouncementposts:show", {model: this.collection.get(selector.data("id"))});
        }
    });
});
