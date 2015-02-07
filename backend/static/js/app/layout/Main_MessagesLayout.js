define([
    'app',
    'jquery',
    'backbone',
    'marionette',
    'underscore',
    'handlebars',
    'views/Main_MessagesSideBarView',
    'layout/Main_MessageBoxLayout',
    'text!templates/main_messageslayout.html'
],  function (App, $, Backbone, Marionette, _, Handlebars, MessagesSideBarView, MessageBox, template) {

    "use strict";

    return Backbone.Marionette.Layout.extend({

        template: Handlebars.compile(template),

        initialize: function(options){

        },
        regions: {
            sidebarRegion: "#messagessidebarRegion",
            contentRegion: "#messagescontentRegion"
        },
        events: {

        },
        onRender: function(){
            this.sidebarRegion.show(new MessagesSideBarView());
            this.contentRegion.show(new MessageBox());
        }
    });
});
