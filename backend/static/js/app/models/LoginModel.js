/// @file LoginModel.js
/// Contains the information necessary for a login, as well as the error messages shown

define([
    'jquery',
    'marionette',
    'backbone',
    'underscore',
    'backbone.validation'
], function($, Marionette, Backbone, _) {
    'use strict';
    
    return Backbone.Model.extend({
        initialize: function(){
            _.bindAll(this);
        },

        defaults: {
            username: '',
            password: ''
        },
        validation: {
            username: {
                required: true,
                msg: 'Please enter a username'
            },
            password: {
                required: true,
                msg: 'Please enter a password'
            }
        }
    });
});