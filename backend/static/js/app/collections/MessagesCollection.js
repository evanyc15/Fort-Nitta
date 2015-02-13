define([
    'jquery',
    'marionette',
    'backbone',
    'underscore',
    'models/MessageModel'
], function($, Marionette, Backbone, _, MessageModel) {
    'use strict';
    
    return Backbone.Collection.extend({

        model: MessageModel,

    });
});