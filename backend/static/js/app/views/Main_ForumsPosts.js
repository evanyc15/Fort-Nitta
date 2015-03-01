define([
    'app',
    'marionette',
    'handlebars',
    'collections/ForumsPostsCollection',
    'text!templates/main_forumsposts.html',
    'fancybox',
    'jquery-mousewheel',
    'fancybox-buttons',
    'fancybox-media',
    'fancybox-thumbs',
    'imagesloaded'
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

            $("#forumsLoadingOverlay").show();    
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
                    $("div.forumsPostsBox").imagesLoaded(function(){
                        $("#forumsLoadingOverlay").hide();
                        $('.slick-images').slick({
                            accessibility: true,
                            centerMode: true,
                            arrows: true,
                            cssEase: 'ease',
                            infinite: true,
                            slidesToShow: 3,
                            slidesToScroll: 3
                        });
                        $(".fancybox-thumb").fancybox({
                            prevEffect  : 'none',
                            nextEffect  : 'none',
                            helpers : {
                                title   : {
                                    type: 'outside'
                                }
                            }
                        });   
                    });              
                },
                error: function(data){
                   
                },
                complete: function(){
                    self.$el.find("#postsTable").DataTable({
                        "sPaginationType": "full_numbers",
                        "bSort": false,
                        "iDisplayLength": 5,
                        "bLengthChange": false //used to hide the property  
                    });
                }
            });    
            
        },
        onBeforeDestroy: function() {
            this.unbind();
        },
        newPost: function(event){
            if(event){
                event.stopPropagation();
                event.preventDefault();
            }
            this.trigger("click:newpost:show", {model: this.options.model});
        },
        newLike: function(event){
            var htmlElement = $(event.target).closest('.large-10.columns').find('.forumsPostsTile-likeButton');

            if(htmlElement.hasClass('notLiked')){
                var id = htmlElement.closest('.forumsPostsTile').data('id');

                $.ajax({
                    url: '/api/forums/likes/',
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
                            htmlElement.removeClass('notLiked').addClass('isLiked');
                            htmlElement.find('i.fa-thumbs-o-up').removeClass('fa-thumbs-o-up').addClass('fa-thumbs-up');
                            htmlElement.find('.forumsPostsTile-likeText').text('Unlike');
                            htmlElement.find('.forumsPostsTile-likeCountText').text(parseInt(htmlElement.find('.forumsPostsTile-likeCountText').text())+1);
                        }
                    }
                });
            } else if(htmlElement.hasClass('isLiked')){
                var id = htmlElement.closest('.forumsPostsTile').data('id');
                $.ajax({
                    url: '/api/forums/likes/',
                    type: 'DELETE',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({'user_id': App.session.user.get('uid'), 'post_id': id}),
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data){
                        if(data.success){
                            htmlElement.removeClass('secondary').addClass('default');
                            htmlElement.removeClass('isLiked').addClass('notLiked');
                            htmlElement.find('i.fa-thumbs-up').removeClass('fa-thumbs-up').addClass('fa-thumbs-o-up');
                            htmlElement.find('.forumsPostsTile-likeText').text('Like');
                            htmlElement.find('.forumsPostsTile-likeCountText').text(parseInt(htmlElement.find('.forumsPostsTile-likeCountText').text())-1);
                        }
                    }
                });
            }
        }
        
    });
});