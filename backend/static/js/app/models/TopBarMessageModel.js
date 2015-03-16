/// @file TopBarMessageModel.js
/// Sets the model for a message

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
            username: '',
            firstname: '',
            lastname: '',
            message: '',
            message_created: '',
            id: -1
        },

    });
});