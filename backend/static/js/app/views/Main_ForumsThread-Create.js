define([
    'app',
    'marionette',
    'handlebars',
    'models/ForumsThreadModel',
    'text!templates/main_forumsthread-create.html'
], function (App, Marionette, Handlebars, ForumsThreadModel, template){

    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),
        model: new ForumsThreadModel(),

        initialize: function(options){
            this.options = options;
        },
        events: {
            "click #forumsThreadCreate-buttonSubmit": "submitThread",
            "click #forumsThreadCreate-buttonCancel": "cancelButton"
        },
        onRender: function() {    
            var self = this;

            Backbone.Validation.bind(this, {
                model: this.model
            });
            this.model.bind('validated:valid', function(model) {
                console.log("validated");

                $.ajax({
                    url: '/api/forums/threads/',
                    type: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({'category_id': model.get('category_id'),'user_id': model.get('user_id'),'title': model.get('title')}),
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data){
                        self.trigger("click:returnThreads:show", {model: self.options.model});
                    },
                    error: function(){
                        var htmlElement = self.$el.find("textarea[name='title']");
                        var placeholder = htmlElement.attr("placeholder");

                        htmlElement.val("");
                        htmlElement.addClass("error").attr("placeholder","Creating new Thread failed");
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
        onBeforeDestroy: function() {
            Backbone.Validation.unbind(this, {model: this.model});
            this.unbind();
            this.model.unbind();
        },
        submitThread: function(event){
            console.log("clickclick");
            if(event){
                event.stopPropagation();
                event.preventDefault();
            }
            if(this.$("#forumsThreadCreate-textarea") != ""){
                console.log("textsubmit");
                this.model.set({
                    'title': this.$("#forumsThreadCreate-textarea").val(),
                    'user_id': App.session.user.get('uid'),
                    'category_id': this.options.model.get('id')
                }).validate();
            }
        },
        cancelButton: function(event){
            if(event){
                event.stopPropagation();
                event.preventDefault();
            }
            this.trigger("click:returnThreads:show", {model: this.options.model});
        }
        
    });
});