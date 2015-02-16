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
            "click .forumsThreadTile": "postShow"
        },
        onRender: function() {
            var header;
            if(this.options.id.substring(0,2) === "cc"){
                header = this.options.id.substring(2,this.options.id.length);
            } else if(this.options.id.substring(0,8) === "platform"){
                header = this.options.id.substring(8,this.options.id.length);
            } else if(this.options.id.substring(0,7) === "support"){
                header = this.options.id.substring(7,this.options.id.length);
            }

            if(header === "GeneralNewsDiscussion"){
                header = "General News & Discussion";
            } else if(header === "GeneralHelpHowTo"){
                header = "General Help & How To";
            } else if(header === "UserAccounts"){
                header = "User Accounts";
            }

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
        }

        
    });
});