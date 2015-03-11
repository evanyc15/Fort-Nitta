/// @file AdminGlobalAnnouncementsPostsCollection.js
/// Collection definition for global announcements posts model
define([
    'jquery',
    'marionette',
    'backbone',
    'underscore',
    'models/AdminGlobalAnnouncementsPostsModel'
], function($, Marionette, Backbone, _, AdminGlobalAnnouncementsPostsModel) {
    'use strict';
    
    return Backbone.Collection.extend({

        model: AdminGlobalAnnouncementsPostsModel,

    });
});