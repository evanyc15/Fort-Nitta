define([
    'app',
    'jquery',
    'marionette',
    'backbone',
    'underscore',
    'models/UserModel',
    'cookie'
], function(App, $, Marionette, Backbone, _, UserModel) {
    'use strict';

    return Backbone.Model.extend({
         // Initialize with negative/empty defaults
        // These will be overriden after the initial checkAuth
        defaults: {
            logged_in: false,
            user_id: ''
        },

        initialize: function(){
            _.bindAll(this);

            // Singleton user object
            // Access or listen on this throughout any module with app.session.user
            this.user = new UserModel({});
        },


        url: function(){
            return '/api';
            // return '/api/users';
        },

        // Fxn to update user attributes after recieving API response
        updateSessionUser: function( userData ){
            this.user.set(_.pick(userData, _.keys(this.user.defaults)));
        },

        /*
         * Check for session from API 
         * The API will parse client cookies using its secret token
         * and return a user object if authenticated
         */
        checkAuth: function(callback, args) {
            var self = this;

            $.ajax({ 
                url: this.url() + '/session_auth/',
                type: 'GET',
                contentType: 'application/json',
                dataType: 'json',
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function(mod, res){
                    if(mod.authenticated && mod.user){
                        self.updateSessionUser(mod.user);
                        self.set({ logged_in : true , user_id: mod.user.uid });
                        return callback(true); 
                    } else {
                        self.set({ logged_in : false , user_id: ''  });
                        if('error' in callback) callback.error(mod, res);  
                        return callback(false);
                    }
                }, error:function(mod, res){
                    self.set({ logged_in : false , user_id: ''});
                    return callback(false);
                }
            });
        },

        /*
         * Abstracted fxn to make a POST request to the auth endpoint
         * This takes care of the CSRF header for security, as well as
         * updating the user and session after receiving an API response
         */
        postAuth: function(opts, callback, args){
            var self = this;
            var postData = _.omit(opts, 'method');
           
            $.ajax({
                url: this.url() + '/' + opts.method,
                contentType: 'application/json',
                dataType: 'json',
                type: 'POST',
                crossDomain: true,
                // beforeSend: function(xhr) {
                //     // Set the CSRF Token in the header for security
                //     var token = $('meta[name="csrf-token"]').attr('content');
                //     if (token) xhr.setRequestHeader('X-CSRF-Token', token);
                // },
                xhrFields: {
                    withCredentials: true
                },
                data:  JSON.stringify(postData.data),
                success: function(res){

                    if( res.success ){
                        if(_.indexOf(['session_auth/', 'users/register/'], opts.method) !== -1){
                            self.updateSessionUser( res.user || {} );
                            self.set({ user_id: res.user.uid, logged_in: true });
                        } else {
                            self.set({ logged_in: false , user_id: '' });
                        }

                        if(callback && 'success' in callback) callback.success(res);
                    } else { 
                        if(callback && 'error' in callback) callback.error(res);
                    }
                },
                error: function(res, data){
                    if(callback && 'error' in callback) callback.error(res);
                    self.set({ logged_in: false , user_id: '' });
                }
            }).complete( function(){
                    if(callback && 'complete' in callback) callback.complete(res);
            });
        },

        /*
         * Abstracted fxn to make a DELETE request to the auth endpoint
         * This is used to logout the user
         */
        deleteAuth: function(opts, callback, args){
            var self = this;
            var postData = _.omit(opts, 'method');
            // console.log(postData);
            $.ajax({
                url: this.url() + '/' + opts.method,
                contentType: 'application/json',
                type: 'DELETE',
                crossDomain: true,
                // beforeSend: function(xhr) {
                //     // Set the CSRF Token in the header for security
                //     var token = $('meta[name="csrf-token"]').attr('content');
                //     if (token) xhr.setRequestHeader('X-CSRF-Token', token);
                // },
                xhrFields: {
                    withCredentials: true
                },
                data:  JSON.stringify( _.omit(opts, 'method') ),
                success: function(res){

                    if( res.success ){
                        if(_.indexOf(['session_auth/'], opts.method) !== -1){
                            // self.set({ logged_in: false , user_id: '' });
                            self.clear().set(self.defaults);
                        }
                        if(callback && 'success' in callback) callback.success(res);
                    } else { 
                        if(callback && 'error' in callback) callback.error(res);
                    }
                },
                error: function(mod, res){
                    if(callback && 'error' in callback) callback.error(res);
                    // self.set({ logged_in: false , user_id: ''});
                    self.clear().set(self.defaults);
                }
            }).complete( function(){
                    if(callback && 'complete' in callback) callback.complete(res);
            });
        },
        login: function(opts, callback, args){
            this.postAuth(_.extend(opts, { method: 'session_auth/' }), callback);
        },

        logout: function(opts, callback, args){
            this.deleteAuth(_.extend(opts, { method: 'session_auth/' }), callback);
        },

        signup: function(opts, callback, args){
            this.postAuth(_.extend(opts, { method: 'users/register/' }), callback);
        },

        removeAccount: function(opts, callback, args){
            this.postAuth(_.extend(opts, { method: 'remove_account' }), callback);
        },
		changeDetails: function(opts, callback, args){
			this.postAuth(_.extend(opts, { method: 'users/change_details/'}), callback);
		},
        settings: function(opts, callback, args){
            this.postAuth(_.extend(opts, { method: 'users/settings/'}), callback);
        }

    });
});