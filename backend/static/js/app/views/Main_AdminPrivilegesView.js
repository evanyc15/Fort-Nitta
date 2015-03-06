/* RequireJS Module Dependency Definitions */
define([
    'app',
    'marionette',
    'handlebars',
    'text!templates/main_adminprivileges.html',
    'collections/AdminUserPrivilegesCollection'
], function (App, Marionette, Handlebars, template, AdminUserPrivilegesCollection){
    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),
        collection: new AdminUserPrivilegesCollection(),

        initialize: function(options){
            this.options = options;
        },
        events: {
            "click .adminButton": "adminChange"
        },
        onRender: function() {
            var self = this;
            $.ajax({
                url: '/api/admin/userprivileges/',
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
                    self.$el.find("#userprivilegesTable").DataTable({
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
        adminChange: function(event){
            var selector = $(event.target);
            var id = selector.closest(".adminRows").data("id");

            if(selector.hasClass("isAdmin")){
                $.ajax({
                    url: '/api/admin/userprivileges/',
                    type: 'DELETE',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({'id': id}),
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data){
                        if(data.success){
                            selector.removeClass("isAdmin").addClass("notAdmin");
                            selector.removeClass("success").addClass("secondary");
                            selector.text("Not Admin");
                        }
                    }
                });
            } else if(selector.hasClass("notAdmin")){
                $.ajax({
                    url: '/api/admin/userprivileges/',
                    type: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({'id': id}),
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data){
                        if(data.success){
                            selector.removeClass("notAdmin").addClass("isAdmin");
                            selector.removeClass("secondary").addClass("success");
                            selector.text("Admin");
                        }
                    }
                });
            }
        }
    });
});
