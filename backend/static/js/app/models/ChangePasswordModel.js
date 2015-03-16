/// @file ChangePasswordModel.js
/// Specifies information for password change, as well as returned error messages

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
            password: '',
            repassword: ''
        },
        validation: {
            password: {
                equalTo: "repassword",
                msg: 'Passwords do not match'
            },
            repassword: {
                equalTo: "password",
                msg: 'Passwords do not match'
            }
        }
    });
});