/* RequireJS Module Dependency Definitions */
define([
    'app',
    'marionette',
    'handlebars',
    'text!templates/main_messagessidebar.html',
    'jqueryui'
], function (App, Marionette, Handlebars, template){

    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),

        initialize: function(options){
            this.options = options;

            var self = this;
            this.tags = [];
            $.ajax({
                url: '/retrieveUsers',
                type: 'GET',
                contentType: 'application/json',
                dataType: 'json',
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function(data){
                    var i;
                    for(i = 0; i < data.length; i++){
                        self.tags.push(data[i].username);
                    }
                },
                error: function(){
                
                }
            });
        },
        events: {
         "click .main_messages-user": "switchMessenger"
        },
        onShow: function() {
            var self = this;
            this.$el.find("#main_messages-search-input").autocomplete({
                source: this.tags
            });
            $.ajax({
                url: '/api/messages/users/',
                type: 'GET',
                contentType: 'application/json',
                dataType: 'json',
                data: {'user': App.session.user.get('uid')},
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function(data){
                    // console.log(data);
                    var i;
                    for(i = 0; i < data.length; i++){
                        
                        if(self.$el.find(id).length === 0 && data[i].username !== App.session.user.get('username')){
                            var id = '#' + self.hashCode(data[i].username);
                            var html = "<li class='main_messages-user' id='"+self.hashCode(data[i].username)+"'>"+
                                            "<img class='main_messages-img' src='../../../img/placeholder-user.png'/>"+
                                            "<div class='main_messages-dataBox'>"+
                                                "<div class='main_messages-username'>"+data[i].username+"</div>"+
                                                "<div class='main_messages-name'>"+data[i].first_name+" "+data[i].last_name+"</div>"+
                                            "</div>"+ 
                                        "</li>";
                            self.$el.find('.custom_accordion').append(html); 
                        }
                    }  
                },
                error: function(){
                
                }
            });
        },
        hashCode: function(s){
            return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
        },
        switchMessenger: function(event) {
            this.$(".custom_accordion li").removeClass("active");
            $(event.currentTarget).addClass("active");
            var username = $(event.currentTarget).find('.main_messages-username').text();
            var name = $(event.currentTarget).find('.main_messages-name').text();

            this.trigger("click:Messenger:switch", {'username': username,'name': name});
        }
        
    });
});