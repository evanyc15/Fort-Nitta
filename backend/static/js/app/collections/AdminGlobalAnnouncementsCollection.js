/// AdminGlobalAnnouncementsCollection
///	Collection definition for global announcements model
define([
    'jquery',
    'marionette',
    'backbone',
    'underscore',
    'models/AdminGlobalAnnouncementsModel'
], function($, Marionette, Backbone, _, AdminGlobalAnnouncementsModel) {
    'use strict';
    
    return Backbone.Collection.extend({

        model: AdminGlobalAnnouncementsModel,

    });
});