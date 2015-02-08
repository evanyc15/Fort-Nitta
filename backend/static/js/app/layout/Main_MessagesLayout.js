define([
    'app',
    'jquery',
    'backbone',
    'marionette',
    'underscore',
    'handlebars',
    'views/Main_MessagesSideBarView',
    'layout/Main_MessageBoxLayout',
    'models/MessageModel',
    'text!templates/main_messageslayout.html'
],  function (App, $, Backbone, Marionette, _, Handlebars, MessagesSideBarView, MessageBox, MessageModel, template) {

    "use strict";

    return Backbone.Marionette.LayoutView.extend({

        template: Handlebars.compile(template),

        initialize: function(options){
            var self = this;
            this.messages = new MessageModel({});

            this.messageSideBarView = new MessagesSideBarView();
            this.messageSideBarView.on("click:Messenger:switch", function(data){
                self.messages.set({
                    'username': data.username,
                    'messaging': true
                });
                self.contentRegion.show(new MessageBox({
                    message: self.messages
                }));
            });
        },
        regions: {
            sidebarRegion: "#messagessidebarRegion",
            contentRegion: "#messagescontentRegion"
        },
        events: {

        },
        onRender: function(){
            var self = this;
            this.sidebarRegion.show(this.messageSideBarView);
            this.contentRegion.show(new MessageBox({
                message: self.messages
            }));
        }
    });
});
