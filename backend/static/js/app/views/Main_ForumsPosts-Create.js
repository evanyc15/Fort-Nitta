define([
    'app',
    'marionette',
    'handlebars',
    'models/ForumsPostsModel',
    'text!templates/main_forumsposts-create.html'
], function (App, Marionette, Handlebars, ForumsPostsModel, template){

    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),
        model: new ForumsPostsModel(),

        initialize: function(options){
            this.options = options;
            var self = this;

            this.model.clear();

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
                        self.trigger("click:returnPosts:show", {model: self.options.model});
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
        },
        events: {
            "click #forumsPostsCreate-buttonSubmit": "submitPost",
            "click #forumsPostsCreate-buttonCancel": "cancelButton"
        },
        onRender: function() {
          
        },
        onBeforeDestroy: function(){
            // Need to unbind events to prevent model validation from occuring multiple times when re-entering this view
            // If we do not unbind, there will be multiple bindings of the same event on the same object which causes it to
            // fire multiple times.
            Backbone.Validation.unbind(this, {model: this.model});
            this.model.unbind();
        },
        submitPost: function(event){
            if(event){
                event.stopPropagation();
                event.preventDefault();
            }
            if(this.$("#forumsPostsCreate-textarea") != ""){
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
            this.trigger("click:returnPosts:show", {model: this.options.model});
        }
        
    });
});