/// @file LeaderboardsCollection.js
/// Collection definition for leaderboards model
define([
    'jquery',
    'marionette',
    'backbone',
    'underscore',
    'models/LeaderboardsModel'
], function($, Marionette, Backbone, _, LeaderboardsModel) {
    'use strict';
    
    return Backbone.Collection.extend({

        model: LeaderboardsModel
    });
});