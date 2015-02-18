define([
    'app',
    'marionette',
    'handlebars',
    'text!templates/main_forumsthread.html'
], function (App, Marionette, Handlebars, template){

    "use strict";

    return Marionette.ItemView.extend({
        //Template HTML string
        template: Handlebars.compile(template),

        initialize: function(options){
            this.options = options;
        },
        events: {
            "click .forumsThreadTile": "postShow",
            "click #forumsThread-newThread": "newThread",
        },
        onRender: function() {
            var header;
            var jsonHeaders = {'ccintroductions': 'Introductions', 
                                'ccgeneralnewsdiscussion': 'General News & Discussion',
                                'ccgeneralhelphowto': 'General Help & How To',
                                'platformandroid': 'Android',
                                'platformiososx': 'iOS and OSX',
                                'platformlinux': 'Linux',
                                'platformwindows': 'Windows',
                                'supportuseraccounts': 'User Accounts'};

            header = jsonHeaders[this.options.id];

            this.$el.find("#forumsThread-header").text(header);
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
            var id = $(event.target).closest(".forumsThreadTile").find(".forumsThreadSubject-title").text();

            this.trigger("click:posts:show", {id: id});
        },
        newThread: function(event){
            if(event){
                event.stopPropagation();
                event.preventDefault();
            }
            this.trigger("click:newthread:show");
        }
        
    });
});