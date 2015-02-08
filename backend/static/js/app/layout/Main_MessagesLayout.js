define([
    'app',
    'jquery',
    'backbone',
    'marionette',
    'underscore',
    'handlebars',
    'views/Main_MessagesSidebarView',
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
            // When the sidebar's user chat is clicked, this switches the Message Box (Right container) to the respective chat between the two users
            // We use the session model's variable for "this" user to act as the "from_user". When the user tile on the side bar is clicked
            // The user tile is the "to_user". Thus, "this" user is chatting with another user. We pass the variables into MessageBox and then MessageUser
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
