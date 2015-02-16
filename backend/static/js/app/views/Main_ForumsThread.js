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
         
        },
        onRender: function() {
            var header = this.options.id.replace("cc","").replace("platforms","").replace("support","");

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
        }

        
    });
});