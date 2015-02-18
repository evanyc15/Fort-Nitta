define([
    'jquery',
    'marionette',
    'backbone',
    'underscore',
    'models/ForumsThreadModel'
], function($, Marionette, Backbone, _, ForumsThreadModel) {
    'use strict';
    
    return Backbone.Collection.extend({

        model: ForumsThreadModel,

    });
});