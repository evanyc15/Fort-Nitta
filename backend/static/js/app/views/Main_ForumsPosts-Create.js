define([
    'app',
    'marionette',
    'handlebars',
    'models/ForumsPostsModel',
    'text!templates/main_forumsposts-create.html',
    'dropzone'
], function (App, Marionette, Handlebars, ForumsPostsModel, template){

    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),
        model: new ForumsPostsModel(),

        initialize: function(options){
            this.options = options;
            this.dropzone = null;
            this.post_id = null;
        },
        events: {
            "click #forumsPostsCreate-buttonSubmit": "submitPost",
            "click #forumsPostsCreate-buttonCancel": "cancelButton"
        },
        onRender: function() {
            var self = this;

            $("#forumsLoadingOverlay").hide();
            Backbone.Validation.bind(this, {
                model: this.model
            });
            this.model.bind('validated:valid', function(model) {
                $.ajax({
                    url: '/api/forums/posts/',
                    type: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({'thread_id': model.get('thread_id'),'user_id': model.get('user_id'),'message': model.get('message')}),
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data){
                        if(self.dropzone.files.length !== 0){
                            this.post_id = data.id;
                            self.dropzone.options.headers = { "postid": data.id };
                            self.dropzone.processQueue();
                        } else {
                            self.triggerMethod("click:returnPosts:show", {model: self.options.model});
                        }        
                    },
                    error: function(){
                        var htmlElement = self.$el.find("textarea[name='message']");
                        var placeholder = htmlElement.attr("placeholder");

                        htmlElement.val("");
                        htmlElement.addClass("error").attr("placeholder","Creating new Post failed");
                        setTimeout(function() {
                            htmlElement.removeClass("error").attr("placeholder",placeholder);
                        }, 3000);
                        
                        self.model.clear();
                    }
                });
            });
            this.model.bind('validated:invalid', function(model, errors) {
                Object.keys(errors).forEach(function(k) {
                    var htmlElement = self.$el.find("textarea[name='"+k+"']");
                    var placeholder = htmlElement.attr("placeholder");

                    htmlElement.val("");
                    htmlElement.addClass("error").attr("placeholder",errors[k]);
                    setTimeout(function() {
                        htmlElement.removeClass("error").attr("placeholder",placeholder);
                    }, 3000);
                });
                self.model.clear();
            });

            // $("#forumsPostsCreate-dropzone").dropzone({ url: "/file/post" });
        },
        onShow: function(){
            var self = this;
            this.dropzone = new Dropzone("#forumsPostsCreate-dropzone", 
                { 
                    url: "/api/forums/postsimages/",
                    method: "POST",
                    maxFilesize: 10,
                    maxFiles: 10,
                    parallelUploads: 10,
                    acceptedFiles: "image/*",
                    paramName: "images",
                    withCredentials: true,
                    crossDomain: true,
                    autoProcessQueue: false,
                    addRemoveLinks: true,
                    dictDefaultMessage: "Drop files here or click here to upload images",
                    init: function(){
                        this.on("success", function(data, server){
                             setTimeout(function() {
                                self.triggerMethod("click:returnPosts:show", {model: self.options.model});
                            }, 1500);
                        });
                        this.on("error", function(data, server){
                             $.ajax({
                                url: '/api/forums/posts/',
                                type: 'DELETE',
                                contentType: 'application/json',
                                dataType: 'json',
                                data: JSON.stringify({'post_id': this.post_id}),
                                crossDomain: true,
                                xhrFields: {
                                    withCredentials: true
                                },
                                success: function(response){
                                    setTimeout(function() {
                                        self.triggerMethod("click:returnPosts:show", {model: self.options.model});
                                    }, 1500);
                                }
                            });
                        });
                        this.on("queuecomplete", function (file) {
                           
                        });
                    }
                });
        },
        onBeforeDestroy: function(){
            // Need to unbind events to prevent memory leaks
            Backbone.Validation.unbind(this, {model: this.model});
            this.unbind();
            this.model.unbind();
        },
        submitPost: function(event){
            if(event){
                event.stopPropagation();
                event.preventDefault();
            }
            if(this.$("#forumsPostsCreate-textarea") !== ""){
                this.model.set({
                    'message': this.$("#forumsPostsCreate-textarea").val(),
                    'user_id': App.session.user.get('uid'),
                    'thread_id': this.options.model.get('id')
                }).validate();
            }
        },
        cancelButton: function(event) {
            if(event){
                event.stopPropagation();
                event.preventDefault();
            }
            this.triggerMethod("click:returnPosts:show", {model: this.options.model});
        }
        
    });
});