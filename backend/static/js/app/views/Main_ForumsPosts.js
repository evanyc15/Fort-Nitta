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
           "click #forumsPosts-reply": "newPost",
           "click .forumsPostsTile-likeButton": "newLike"
        },
        onRender: function() {
            var self = this;
            
            $.ajax({
                url: '/api/forums/posts?thread_id='+this.options.model.get('id')+'&user_id='+App.session.user.get('uid'),
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
                    $('.slick-images').slick({
                        accessibility: true,
                        centerMode: true,
                        arrows: true,
                        cssEase: 'ease',
                        dots: true,
                        infinite: true,
                        slidesToShow: 3,
                        slidesToScroll: 3
                    });

                },
                error: function(data){
                   
                },
                complete: function(){
                    self.$el.find("#postsTable").DataTable({
                        "sPaginationType": "full_numbers",
                        "bSort": false,
                        "iDisplayLength": 5,
                    });
                }
            });    
            
        },
        newPost: function(event){
            if(event){
                event.stopPropagation();
                event.preventDefault();
            }
            this.trigger("click:newpost:show", {model: this.options.model});
        },
        newLike: function(event){
            var htmlElement = $(event.target);

            if(htmlElement.find('i.fa-thumbs-o-up').length !== 0){
                var id = htmlElement.closest('.forumsPostsTile').data('id');

                $.ajax({
                    url: '/api/forums/likes',
                    type: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({'user_id': App.session.user.get('uid'), 'post_id': id}),
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data){
                        if(data.success){
                            htmlElement.removeClass('default').addClass('secondary');
                            htmlElement.find('i.fa-thumbs-o-up').removeClass('fa-thumbs-o-up').addClass('fa-thumbs-up');
                            htmlElement.find('span').text(parseInt(htmlElement.find('span').text())+1);
                        }
                    }
                });
            }
        }
        
    });
});