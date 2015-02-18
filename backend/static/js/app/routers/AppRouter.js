define([
    'marionette', 
    'controllers/Controller'
    ], function(Marionette, Controller) {

    'use strict';
    return Marionette.AppRouter.extend({
            
        //"index" must be a method in AppRouter's controller
        appRoutes: {
            '': 'index',
            'home/:action/:id': 'index',
            'home/:action': 'index',
            'home': 'index', 
            'main/:action/:action2': 'main', 
            'main/:action/:id': 'main',
            'main/:action': 'main',
            'main':'main'         
        }
    });
});