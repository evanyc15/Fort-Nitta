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
            game_id: '',
            user_id: '',
            numCannons: '',
            numFires: '',
            numWalls: '',
            num_players: '',
            winner_id: ''
        },
    });
});