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
            first_name: '',
            last_name: '',
            username: '',
            email: '',
            password: '',
            repassword: ''
        },
        validation: {
            first_name: {
                required: true,
                msg: 'Please enter a first name'
            },
            last_name: {
                required: true,
                msg: 'Plase enter a last name'
            },
            username: [{
                required: true,
                msg: 'Please enter a username'
            }, {
                minLength: 4,
                msg: 'Please enter a username of at least 4 characters'
            }],
            email: [{
                required: true,
                msg: 'Please enter an email'
            }, {
                pattern: 'email',
                msg: 'Please enter a valid email'
            }],
            password: [{
                required: true,
                msg: 'Please enter a password'
            }, {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                msg: 'Need an upper/lowercase and a number'
            },{
                equalTo: 'repassword',
                msg: 'Passwords should be the same'
            }],
            repassword: [{
                required: true,
                msg: 'Please enter a password'
            }, {
                equalTo: 'password',
                msg: 'Passwords should be the same'
            }]
      }

    });
});