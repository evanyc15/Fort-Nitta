//! Collection definition for forums posts model
define([
    'jquery',
    'marionette',
    'backbone',
    'underscore',
    'models/ForumsPostsModel'
], function($, Marionette, Backbone, _, ForumsPostsModel) {
    'use strict';
    
    return Backbone.Collection.extend({

        model: ForumsPostsModel,

    });
});