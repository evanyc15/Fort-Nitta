/// @file GameInfoCollection.js
/// Collection definition for game info model
define([
    'jquery',
    'marionette',
    'backbone',
    'underscore',
    'models/GameInfoModel'
], function($, Marionette, Backbone, _, GameInfoModel) {
    'use strict';
    
    return Backbone.Collection.extend({

        model: GameInfoModel,

    });
});