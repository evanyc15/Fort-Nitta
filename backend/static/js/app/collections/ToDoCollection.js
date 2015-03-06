define([
    'jquery',
    'marionette',
    'backbone',
    'underscore',
    'models/ToDoModel'
], function($, Marionette, Backbone, _, ToDoModel) {
    'use strict';
    
    return Backbone.Collection.extend({

        model: ToDoModel,

    });
});