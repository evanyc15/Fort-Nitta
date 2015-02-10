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