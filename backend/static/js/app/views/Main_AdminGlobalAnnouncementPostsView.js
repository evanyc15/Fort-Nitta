/* RequireJS Module Dependency Definitions */
define([
    'app',
    'marionette',
    'handlebars',
    'text!templates/main_adminglobalannouncementsposts.html',
    'collections/AdminGlobalAnnouncementsPostsCollection'
], function (App, Marionette, Handlebars, template, AdminGlobalAnnouncementsPostsCollection){
    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),
        collection: new AdminGlobalAnnouncementsPostsCollection(),

        initialize: function(options){
            this.options = options;
        },
        events: {
            "click #createglobalannouncementpost": "createglobalannouncementpost"
        },
        onRender: function() {
            var self = this;

            $.ajax({
                url: '/api/admin/announcementposts?id='+this.options.model.get('id'),
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
                    self.$el.find("#globalAnnouncementspostsTable").DataTable({
                        "sPaginationType": "full_numbers",
                        "bSort": false,
                        "iDisplayLength": 10,
                        "bLengthChange": false //used to hide the property  
                    });
                    self.$el.find("#announcementpost-header").text('"'+self.options.model.get('subject')+'"');
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
        createglobalannouncementpost: function() {
            this.triggerMethod("click:newglobalannouncementpost:show", {model: this.options.model});
        }
    });
});
