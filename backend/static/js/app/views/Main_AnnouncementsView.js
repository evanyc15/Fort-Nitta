/* RequireJS Module Dependency Definitions */
define([
    'app',
    'marionette',
    'handlebars',
    'text!templates/main_announcements.html',
    'collections/AnnouncementsCollection',
    'moment'
], function (App, Marionette, Handlebars, template, AnnouncementsCollection){
    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),
        collection: new AnnouncementsCollection(),

        initialize: function(options){
            this.options = options;

            // Reset collection because it is saved when using the "back" button which causes bugs
            this.collection.reset();     
        },
        events: {
          
        },
        onRender: function(){
            var self = this;
            $.ajax({
                url: '/api/announcements/',
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
                   
                }
            }); 
        },
        onBeforeDestroy: function(){
            this.unbind();
        },
    });
});