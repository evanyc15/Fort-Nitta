define([
    'app',
    'jquery',
    'backbone',
    'marionette',
    'underscore',
    'handlebars',
    'views/Main_MessagesSideBarView',
    'views/Main_MessagesUserView',
    'text!templates/main_messageslayout.html'
],  function (App, $, Backbone, Marionette, _, Handlebars, MessagesSideBarView, MessagesUserView, template) {

    "use strict";

    return Backbone.Marionette.Layout.extend({

        template: Handlebars.compile(template),

        initialize: function(options){

        },
        regions: {
            sidebarRegion: "#sidebarRegion",
            contentRegion: "#contentRegion"
        },
        events: {

        },
        onRender: function(){
            this.sidebarRegion.show(new MessagesSideBarView());
            this.contentRegion.show(new MessagesUserView());
        }
    });
});
