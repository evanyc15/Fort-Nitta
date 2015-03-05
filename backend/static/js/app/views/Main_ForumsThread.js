define([
    'app',
    'marionette',
    'handlebars',
    'collections/ForumsThreadCollection',
    'collections/ForumsCategoryCollection',
    'text!templates/main_forumsthread.html',
    'imagesloaded'
], function (App, Marionette, Handlebars, ForumsThreadCollection, ForumsCategoryCollection, template){

    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),
        collection: new ForumsThreadCollection(),

        initialize: function(options){
            this.options = options;

            this.categoryCollection = new ForumsCategoryCollection();

            // Reset collection because it is saved when using the "back" button which causes bugs
            this.collection.reset();

            // This is to create a helper for the template
            Handlebars.registerHelper('ifevenodd', function (id, options) { 

                if(id % 2){
                    return options.inverse(this);
                } else {  
                    return options.fn(this);
                }
            });
        },
        events: {
            "click .forumsThreadTile": "postShow",
            "click #forumsThread-newThread": "newThread",
        },
        onRender: function() {
            var self = this;
            $("#forumsLoadingOverlay").show();

            var header;
            var jsonHeaders = {'ccintroductions': 'Introductions', 
                                'ccgeneralnewsdiscussion': 'General News & Discussion',
                                'ccgeneralhelphowto': 'General Help & How To',
                                'platformandroid': 'Android',
                                'platformiososx': 'iOS and OSX',
                                'platformlinux': 'Linux',
                                'platformwindows': 'Windows',
                                'supportuseraccounts': 'User Accounts'};

            var categoryModel = this.categoryCollection.findWhere({'category_name':this.options.model.get('category_name').toLowerCase()});
            header = jsonHeaders[categoryModel.get('category_name').toLowerCase()];

            this.options.model.set({id:categoryModel.get('id')});

            this.$(".forumsThreadTile").remove();
            $.ajax({
                url: '/api/forums/threads?id='+categoryModel.get('id'),
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

                    self.$el.find("#forumsThread-header").text(header);

                    // Redirect to a Thread's specific post if the user has inputted the right url into the browser.
                    if(self.options.id && self.options.id !== "null"){
                        self.triggerMethod("click:posts:show", {model: self.collection.get(self.options.id), 'redirect': true});
                    }
                },
                error: function(data){
                   
                },
                complete: function() {
                    $("#forumsContentRegion").imagesLoaded(function(){
                        $("#forumsLoadingOverlay").hide();
                    });
                    self.$el.find("#threadTable").DataTable({
                        "sPaginationType": "full_numbers",
                        "bAutoWidth": false, // Disable the auto width calculation 
                        "aoColumns": [
                            { "sWidth": "70%" },
                            { "sWidth": "10%" },
                            { "sWidth": "20%" },
                        ],
                        "bLengthChange": false //used to hide the property  
                    });
                }
            });    
        },
        onBeforeDestroy: function() {
            this.unbind();
        },
        postShow: function(event){
            var id = $(event.target).closest(".forumsThreadTile").data("id");

            // Redirect is to determine if user inputted an url to a specific post or if they are going to the post via clicking from categories->threads->post
            this.triggerMethod("click:posts:show", {model: this.collection.get(id), 'redirect': false});
        },
        newThread: function(event){
            if(event){
                event.stopPropagation();
                event.preventDefault();
            }
            this.triggerMethod("click:newthread:show", {model: this.options.model});
        }
        
    });
});