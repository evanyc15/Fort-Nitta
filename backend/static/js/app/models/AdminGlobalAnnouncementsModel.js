/// @file AdminGlobalAnnouncementsModel.js
/// Sets the layout for global announcements

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
            subject: '',
            posted_by: '',
            date_created: ''
        }
    });
});