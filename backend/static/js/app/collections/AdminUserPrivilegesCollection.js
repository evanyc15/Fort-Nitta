define([
    'jquery',
    'marionette',
    'backbone',
    'underscore',
    'models/AdminUserPrivilegesModel'
], function($, Marionette, Backbone, _, AdminUserPrivilegesModel) {
    'use strict';
    
    return Backbone.Collection.extend({

        model: AdminUserPrivilegesModel,

    });
});