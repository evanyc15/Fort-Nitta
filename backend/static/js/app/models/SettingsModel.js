/// @file SettingsModel.js
/// Sets the information model, and error messages for the Settings page

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
            first_name: '',
            last_name: '',
            email: '',
            oldpassword: '',
            password: '',
            repassword: ''
        },
        validation: {
            password: {
                equalTo: 'repassword',
                msg: 'Passwords do not match'
            },
            repassword: {
                equalTo: 'password',
                msg: 'Passwords do not match'
            }
        }
    });
});