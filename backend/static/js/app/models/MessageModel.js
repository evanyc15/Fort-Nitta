/// @file MessageModel.js
/// Sets what information is necessary for a chat message

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
            from_username: '',
            from_firstname: '',
            from_lastname: '',
            to_username: '',
            to_firstname: '',
            to_lastname: '',
            message: '',
            message_created: '',
            id: -1
        },

    });
});