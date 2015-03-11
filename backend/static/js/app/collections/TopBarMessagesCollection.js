/// @file TopBarMessagesCollection.js
/// Collection definition for top bar messages model
define([
    'jquery',
    'marionette',
    'backbone',
    'underscore',
    'models/TopBarMessageModel'
], function($, Marionette, Backbone, _, TopBarMessageModel) {
    'use strict';
    
    return Backbone.Collection.extend({

        model: TopBarMessageModel,

    });
});