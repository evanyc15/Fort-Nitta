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
            uid: 0,
            firstname: '',
            lastname: '',
            username: ''
        },

        // url: function(){
        //     return '/api/user';
        // }


    });
});