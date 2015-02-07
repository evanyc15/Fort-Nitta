define([
    'app',
    'jquery',
    'backbone',
    'marionette',
    'underscore',
    'handlebars',
    'views/Main_MessagesUserView',
    'text!templates/main_messagebox.html'
],  function (App, $, Backbone, Marionette, _, Handlebars, MessagesUserView, template) {

    "use strict";

    return Backbone.Marionette.Layout.extend({

        template: Handlebars.compile(template),

        initialize: function(options){

        },
        regions: {
            contentRegion: "#messageschatRegion"
        },
        events: {

        },
        onRender: function(){
            this.contentRegion.show(new MessagesUserView());
        }
    });
});
