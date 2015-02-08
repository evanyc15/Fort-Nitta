/* RequireJS Module Dependency Definitions */
define([
    'app',
    'marionette',
    'handlebars',
    'text!templates/main_messagesuser.html'
], function (App, Marionette, Handlebars, template){

    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),

        initialize: function(options){
            this.options = options;
            this.message_id = 0;
        },
        events: {
         
        },
        onRender: function(){
            var self = this;
            this.$el.find('.messages-loader').show();
            this.sse = new EventSource('/messageStream?from_username='+App.session.user.get('username')+'&to_username='+this.options.message.get('username'));
            this.sse.addEventListener('message', function(e) {
                var results = JSON.parse(e.data);
                var i;
                $('.messages-loader').hide();
                for(i = 0; i < results.length; i++){
                    if(self.message_id < results[i].message_id){
                        var html = "<div class='row userMessageBox'>"+
                                    "<div class='large-1 columns'>"+
                                        "<img class='userMessageBox-img' src='../../../img/placeholder-user.png'/>"+
                                    "</div>"+
                                    "<div class='large-11 columns'>"+
                                        "<div class='userMessageBox-username'>"+results[i].from_username+"</div>"+
                                        "<div class='userMessageBox-name'>"+results[i].from_firstname+" "+results[i].from_lastname+"</div>"+
                                        "<div class='userMessageBox-datetime'>"+results[i].message_created+"</div>"+
                                        "<div class='userMessageBox-comment'>"+results[i].message+"</div>"+
                                    "</div>"+
                                "</div>";
                        self.$el.find('#messages-userContainer').append(html); 
                        if(self.message_id < results[i].message_id){
                           self.message_id = results[i].message_id;
                        }
                    } 
                }  
            },false);
            this.sse.addEventListener('error', function(e){
                $('.messages-loader').hide();
            },false);
        },
        onBeforeDestroy: function(){
            this.sse.close();
        }
    });
});