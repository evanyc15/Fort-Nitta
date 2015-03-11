/// @file PlayersCollection.js
/// Collection definition for players model
define([
    'jquery',
    'marionette',
    'backbone',
    'underscore',
    'models/PlayersModel'
], function($, Marionette, Backbone, _, PlayersModel) {
    'use strict';
    
    return Backbone.Collection.extend({

        model: PlayersModel,

    });
});