/* RequireJS Module Dependency Definitions */
define([
    'app',
    'marionette',
    'handlebars',
    'collections/MessagesCollection',
    'text!templates/main_messagesuser.html'
], function (App, Marionette, Handlebars, MessagesCollection, template){

    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),
        collection: new MessagesCollection(),

        initialize: function(options){
            this.options = options;        
        },
        events: {
         
        },
        onRender: function(){
            var self = this;

            this.$el.find('.messages-loader').show();
            $.ajax({
                url: '/api/messages/chat/',
                type: 'PUT',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({'from_username': App.session.user.get('username'),'to_username':this.options.messagesUser.get('username')}),
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function(data){
                    // console.log(data);
                },
            });


            // This is to get the messages in the current chat between two users (one which is "this" user)
            this.sse = new EventSource('/messageStream?from_username='+App.session.user.get('username')+'&to_username='+this.options.messagesUser.get('username'));
            this.sse.addEventListener('message', function(e) {
                var results = JSON.parse(e.data);
                var i;

                console.log(results);

                for(i = 0; i < results.length; i++){
                    if(results[i].from_avatar_path == "" || typeof results[i].from_avatar_path == "undefined" || results[i].from_avatar_path === null){
                        results[i].from_avatar_path = "../../../img/placeholder-user.png";
                    } else {
                        results[i].from_avatar_path = '/api/avatar/'+results[i].from_avatar_path;
                    }
                }
                self.collection.add(results, {merge: true});
                $('.messages-loader').hide();

                var html = self.template(self.collection.toJSON());
                self.$el.html(html);
                
                $("#messageschatRegion").scrollTop($("#messageschatRegion")[0].scrollHeight);
            },false);
            this.sse.addEventListener('error', function(e){
                $('.messages-loader').hide();
            },false);
        },
        onBeforeDestroy: function(){
            this.collection.reset();
            this.collection.unbind();
            this.sse.close();
            this.remove();
        }
    });
});