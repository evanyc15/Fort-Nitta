/// @file ForumsThreadModel.js
/// Specifies layout for each forum thread

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
            title: '',
            replies: '',
            views: '',
            lastpost_id: -1,
            category_id: -1,
            date_created: ''
        },
        validation: {
            title: {
                required: true,
                msg: 'Please enter a thread title'
            }
        }

    });
});