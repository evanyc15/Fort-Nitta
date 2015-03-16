/// @file PlayersModel.js
/// Defines what information is held for each player

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
            id: '',
            username: '',
            firstname: '',
            lastname: '',
            web_online: false,
            game_online: false
        },

    });
});