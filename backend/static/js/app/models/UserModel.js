/// @file UserModel.hs
/// Specifies the model for storing all user information on client

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
            uid: 0,
            first_name: '',
            last_name: '',
            username: '',
            email: '',
            date_joined: '',
            avatar_path: '',
            new_user: 1,
            admin: false
        },

    });
});