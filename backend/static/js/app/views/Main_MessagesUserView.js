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
            var self = this;

            var sse = new EventSource('/messageStream?from_username='+App.session.user.get('username')+'&to_username='+this.options.message.get('username'));
            sse.addEventListener('message', function(e) {
                var results = JSON.parse(e.data);
                var i;
                console.log(results);
                for(i = 0; i < results.length; i++){
                    if(self.options.message.get('id') < results[i].message_id){
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
                        self.$el.append(html); 
                        var message_id = self.options.message.get('id');
                        if(message_id < results[i].message_id){
                            self.options.message.set({
                                'id': results[i].message_id
                            });
                        }
                    } 
                }  
            },false);
        },
        events: {
         
        },
        onShow: function() {
            var self = this;
            // $.ajax({
            //     url: '/api/messages/chat/',
            //     type: 'GET',
            //     contentType: 'application/json',
            //     dataType: 'json',
            //     data: {'from_username': App.session.user.get('username') ,'to_username': self.options.message.get('username'),'message_id':self.options.message.get('id')},
            //     crossDomain: true,
            //     xhrFields: {
            //         withCredentials: true
            //     },
            //     success: function(data){
            //         // console.log(data);
            //         var i;
            //         for(i = 0; i < data.length; i++){
            //             var html = "<div class='row userMessageBox'>"+
            //                             "<div class='large-1 columns'>"+
            //                                 "<img class='userMessageBox-img' src='../../../img/placeholder-user.png'/>"+
            //                             "</div>"+
            //                             "<div class='large-11 columns'>"+
            //                                 "<div class='userMessageBox-username'>"+data[i].from_username+"</div>"+
            //                                 "<div class='userMessageBox-name'>"+data[i].from_firstname+" "+data[i].from_lastname+"</div>"+
            //                                 "<div class='userMessageBox-datetime'>"+data[i].message_created+"</div>"+
            //                                 "<div class='userMessageBox-comment'>"+data[i].message+"</div>"+
            //                             "</div>"+
            //                         "</div>";
            //             self.$el.append(html); 
            //             var message_id = self.options.message.get('id');
            //             if(message_id < data[i].message_id){
            //                 self.options.message.set({
            //                     'id': data[i].message_id
            //                 });
            //             }
            //         }  
            //     },
            //     error: function(){
                
            //     }
            // });

            // <div class='row userMessageBox'>
            //     <div class='large-1 columns'>
            //         <img class='userMessageBox-img' src='../../../img/placeholder-user.png'/>
            //     </div>
            //     <div class='large-11 columns'>
            //         <div class='userMessageBox-username'>Bob_Doe123</div>
            //         <div class='userMessageBox-name'>Bob Doe</div>
            //         <div class='userMessageBox-datetime'>February 2nd, 2015 1:46PM</div>
            //         <div class='userMessageBox-comment'></div>
            //     </div>
            // </div>
        }

        
    });
});