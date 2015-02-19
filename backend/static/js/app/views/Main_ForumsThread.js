define([
    'app',
    'marionette',
    'handlebars',
    'collections/ForumsThreadCollection',
    'collections/ForumsCategoryCollection',
    'text!templates/main_forumsthread.html'
], function (App, Marionette, Handlebars, ForumsThreadCollection, ForumsCategoryCollection, template){

    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),
        collection: new ForumsThreadCollection(),

        initialize: function(options){
            this.options = options;

            this.categoryCollection = new ForumsCategoryCollection();

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
                },
                error: function(data){
                   
                }
            });    
            this.$el.find("#threadTable").DataTable({
                "sPaginationType": "full_numbers",
                "bAutoWidth": false, // Disable the auto width calculation 
                "aoColumns": [
                    { "sWidth": "70%" },
                    { "sWidth": "10%" },
                    { "sWidth": "20%" },
                ],
            });
        },
        postShow: function(event){
            var id = $(event.target).closest(".forumsThreadTile").data("id");

            this.trigger("click:posts:show", {model: this.collection.get(id)});
        },
        newThread: function(event){
            if(event){
                event.stopPropagation();
                event.preventDefault();
            }
            this.trigger("click:newthread:show", {model: this.options.model});
        }
        
    });
});