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