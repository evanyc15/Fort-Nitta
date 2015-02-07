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
        },
        events: {
         "click .main_messages-user": "switchMessenger"
        },
        onShow: function() {
            var self = this;
            var tags = ["bob_doe123","ghostsp15","test123","ghost12","ghost1235","bob_miller234","bryanScott1235"];
            this.$el.find("#main_messages-search-input").autocomplete({
                source: tags
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
                    console.log(data);
                    var i;
                    for(i = 0; i < data.length; i++){
                        var id = '#' + self.hashCode(data[i].username);
                        if(self.$el.find(id).length === 0){
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
        }
        
    });
});