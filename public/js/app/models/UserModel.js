define([
  'jquery',
  'marionette',
  'backbone',
  'underscore'
], function($, Marionette, Backbone, _) {
    return Backbone.Model.extend({
       initialize: function(){
            _.bindAll(this);
        },

        defaults: {
            id: 0,
            firstname: '',
            lastname: '',
            username: '',
            email: '',
            password: '' 
        },

        url: function(){
            return '/api/user';
        }


    });
});