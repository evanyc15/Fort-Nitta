/// @file MessageUserModel.js
/// Contains information about the users involved in a chat message

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
            name: '',
            messaging: false
        },

    });
});