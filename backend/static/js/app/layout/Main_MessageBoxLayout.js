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

    return Backbone.Marionette.LayoutView.extend({

        template: Handlebars.compile(template),

        initialize: function(options){
            this.options = options;
        },
        regions: {
            contentRegion: "#messageschatRegion"
        },
        events: {
            "keyup #messages-chatInput": "chatKeyUp",
            "click #messages-chatSubmit": "submitMessage"
        },
        onRender: function(){
            var self = this
            if(this.options.message.get('messaging')){
                this.contentRegion.show(new MessagesUserView({
                    message: self.options.message
                }));
            }
        },
        onShow: function() {
            if(this.options.message.get('messaging')){
                this.$el.find('#messages-chatNameDisplay').text("From "+App.session.user.get('username')+ " to "+this.options.message.get('username'));
            }
        },
        chatKeyUp: function(event) {
            var k = event.keyCode || event.which;

            if (k == 13 && this.$('#messages-chatInput').val() === ''){
                event.preventDefault();   // prevent enter-press submit when input is empty
            } else if(k == 13){
                event.preventDefault();
                this.submitMessage();
                return false;
            }
        },
        submitMessage: function(event) {
            if(event){
                event.stopPropagation();
                event.preventDefault();
            }  
            var message = this.$('#messages-chatInput').val();
            if(message !== ''){
                var self = this;
                $.ajax({
                    url: '/api/messages/chat/',
                    type: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({'from_user':App.session.user.get('username'),'to_user':self.options.message.get('username'),'message':message}),
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data){
                        self.$("#messages-chatInput").val("");
                    },
                    error: function(){

                    }
                });
            }
        }
    });
});
