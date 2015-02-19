define([
    'app',
    'marionette',
    'handlebars',
    'collections/ForumsPostsCollection',
    'text!templates/main_forumsposts.html'
], function (App, Marionette, Handlebars, ForumsPostsCollection, template){

    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),
        collection: new ForumsPostsCollection(),

        initialize: function(options){
            this.options = options;

            // Reset collection because it is saved when using the "back" button which causes bugs
            this.collection.reset();

            Handlebars.registerHelper('ifevenodd', function (id, options) { 
                if(id % 2){
                    return options.inverse(this);
                } else {  
                    return options.fn(this);
                }
            });
        },
        events: {
           "click #forumsPosts-reply": "newPost"
        },
        onRender: function() {
            var self = this;

            $.ajax({
                url: '/api/forums/posts?id='+this.options.model.get('id'),
                type: 'GET',
                contentType: 'application/json',
                dataType: 'json',
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function(data){
                    self.collection.add(data, {merge: true});

                    var html = self.template(self.collection.toJSON());
                    self.$el.html(html);

                    self.$el.find("#forumsPosts-header").text(self.options.model.get('title'));

                },
                error: function(data){
                   
                }
            });    
            this.$el.find("#postsTable").DataTable({
                "aDataSort": false,
                "aaSorting": [],
                "bSort": false
            });
        },
        newPost: function(event){
            if(event){
                event.stopPropagation();
                event.preventDefault();
            }
            this.trigger("click:newpost:show", {model: this.options.model});
        }
        
    });
});