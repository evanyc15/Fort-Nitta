define([
    'marionette', 
    'controllers/Controller'
    ], function(Marionette, Controller) {

    'use strict';
    return Marionette.AppRouter.extend({
            
        //"index" must be a method in AppRouter's controller
        appRoutes: {
   		   '': 'index',
         'home': 'index',
   		   'home/:action': 'index',
         'main':'main',
   		   'main/:action': 'main'  
        }
    });
});