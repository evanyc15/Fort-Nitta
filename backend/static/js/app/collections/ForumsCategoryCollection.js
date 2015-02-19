define([
    'jquery',
    'marionette',
    'backbone',
    'underscore',
    'models/ForumsCategoryModel'
], function($, Marionette, Backbone, _, ForumsCategoryModel) {
    'use strict';
    
    return Backbone.Collection.extend({

        model: ForumsCategoryModel,

        initialize: function(){
            this.add([
                {'id': 1, 'category_name': 'ccintroductions'},
                {'id': 2, 'category_name': 'ccgeneralnewsdiscussion'},
                {'id': 3, 'category_name': 'ccgeneralhelphowto'},
                {'id': 4, 'category_name': 'platformandroid'},
                {'id': 5, 'category_name': 'platformiososx'},
                {'id': 6, 'category_name': 'platformlinux'},
                {'id': 7, 'category_name': 'platformwindows'},
                {'id': 8, 'category_name': 'supportuseraccounts'}
            ]);
        }
    });
});