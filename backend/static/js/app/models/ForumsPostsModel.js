define([
    'jquery',
    'marionette',
    'backbone',
    'underscore'
], function($, Marionette, Backbone, _) {
    'use strict';
    
    return Backbone.Model.extend({
        initialize: function(){
            _.bindAll(this);
        },

        defaults: {
            id: -1,
            username: '',
            first_name: '',
            last_name: '',
            avatar_path: '',
            date_created: '',
            post_id: -1,
            message: ''
        },
        validation: {
            message: {
                required: true,
                msg: 'Please enter a Post message'
            }
        }

    });
});