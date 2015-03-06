define([
    'app',
    'jquery',
    'backbone',
    'marionette',
    'underscore',
    'handlebars',
    'models/SessionModel',
    'text!templates/main_adminlayout.html',
    'views/Main_AdminSidebarView',
    'views/Main_AdminGlobalAnnouncementsView',
    'views/Main_AdminToDoView',
    'views/Main_AdminGlobalAnnouncementsCreateView',
    'views/Main_AdminGlobalAnnouncementPostsView',
    'views/Main_AdminGlobalAnnouncementsPostsCreateView',
    'views/Main_AdminPrivilegesView',
    'cookie'
],  function (App, $, Backbone, Marionette, _, Handlebars, SessionModel, template, AdminSidebarView, AdminGlobalAnnouncementsView, AdminToDoView, AdminGlobalAnnouncementsCreateView, AdminGlobalAnnouncementPostsView, AdminGlobalAnnouncementsPostsCreateView, AdminPrivilegesView) {

    "use strict";

    return Backbone.Marionette.LayoutView.extend({
         //Template HTML string
        template: Handlebars.compile(template),

        initialize: function(options){
            this.options = options;
        },
        regions: {
            sidebarRegion: "#sidebarRegion",
            contentRegion: "#adminRegion"
        },
        childEvents: {
            "click:globalannouncements:show": function(){
                this.contentRegion.show(new AdminGlobalAnnouncementsView());
            },
            "click:globalannouncementposts:show": function(childView, data){
                this.contentRegion.show(new AdminGlobalAnnouncementPostsView({
                    model: data.model
                }));
            },
            "click:todo:show": function(){
                this.contentRegion.show(new AdminToDoView());
            },
            "click:newglobalannouncement:show": function(){
                this.contentRegion.show(new AdminGlobalAnnouncementsCreateView());
            },
            "click:newglobalannouncementpost:show": function(childView, data){
                this.contentRegion.show(new AdminGlobalAnnouncementsPostsCreateView({
                    model: data.model
                }));
            },
            "click:privilges:show": function(){
                this.contentRegion.show(new AdminPrivilegesView());
            }
        },
        onRender: function() {
            this.sidebarRegion.show(new AdminSidebarView());
            this.contentRegion.show(new AdminGlobalAnnouncementsView());
        }
    });
});