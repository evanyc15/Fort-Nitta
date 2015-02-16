define([
    'app',
    'jquery',
    'backbone',
    'marionette',
    'underscore',
    'handlebars',
    'views/Main_ForumsMain',
    'views/Main_ForumsThread',
    'text!templates/main_forumslayout.html'
],  function (App, $, Backbone, Marionette, _, Handlebars, ForumsMainView, ForumsThread, template) {

    "use strict";

    return Backbone.Marionette.LayoutView.extend({

        template: Handlebars.compile(template),

        initialize: function(options){
            var self = this;

            this.forumsMainView = new ForumsMainView();

            this.forumsMainView.on("click:thread:show", function(data){
                self.contentRegion.show(new ForumsThread({
                    id: data.id
                }));
                Backbone.history.navigate('main/forums/'+data.id);
            });
        },
        regions: {
            contentRegion: "#forumsContentRegion"
        },
        events: {

        },
        onRender: function(){
            var self = this;
            if(this.options.action === "platformsandroid"){

            } else {
                this.contentRegion.show(this.forumsMainView);
            } 
        }
    });
});
