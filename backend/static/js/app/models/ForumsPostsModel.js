/// @file ForumsPostsModel.js
/// Specifies layout of information needed for each forum post

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
            user_id: '',
            username: '',
            first_name: '',
            last_name: '',
            avatar_path: '',
            date_created: '',
            post_id: -1,
            thread_id: -1,
            message: '',
            user_inLikes: false,
            likes_Count: -1
        },
        validation: {
            message: {
                required: true,
                msg: 'Please enter a Post message'
            }
        }

    });
});