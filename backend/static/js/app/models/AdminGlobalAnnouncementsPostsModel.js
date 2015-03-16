/// @file AdminGlobalAnnouncementsPostsModel.js
/// Sets layout for global announcements messages

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
            message: ''
        },

    });
});