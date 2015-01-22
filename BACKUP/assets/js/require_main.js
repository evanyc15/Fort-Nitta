requirejs.config({
  baseUrl: "assets/",
  paths: {
    app: "js/app",
    "home_Controller": "js/apps/home/home_controller",
    backbone: "bower_components/backbone/backbone",
    "backbone.babysitter": "bower_components/backbone.babysitter/lib/backbone.babysitter.min",
    "backbone.layoutmanager": "bower_components/layoutmanager/backbone.layoutmanager",
    "backbone.stickit": "bower_components/backbone.stickit/backbone.stickit",
    "backbone.validation": "bower_components/backbone-validation/src/backbone-validation",
    "backbone.wreqr": "bower_components/backbone.wreqr/lib/backbone.wreqr",
    fastclick: "bower_components/fastclick/lib/fastclick",
    foundation: "bower_components/foundation/js/foundation.min",
    jquery: "bower_components/jquery/dist/jquery.min",
    json2: "bower_components/json2/json2",
    marionette: "bower_components/marionette/lib/backbone.marionette.min",
    text: "bower_components/requirejs/text",
    underscore: "bower_components/underscore/underscore"
  },

  shim: {
    underscore: {
      exports: "_"
    },
    backbone: {
      deps: ["jquery", "underscore", "json2"],
      exports: "Backbone"
    },
    "backbone.babysitter": {
      deps: ["backbone"],
      exports: "Backbone.Babysitter"
    },
    "backbone.layoutmanager": {
      deps: ["backbone"],
      exports: "Backbone.Layoutmanager"
    },
    "backbone.stickit": {
      deps: ["backbone"],
      exports: "Backbone.Stickit"
    },
    "backbone.validation": {
      deps: ["backbone"],
      exports: "Backbone.Validation"
    },
    "backbone.wreqr":{
      deps: ["backbone"],
      exports: "Backbone.Wreqr"
    },
    foundation: {
      deps: ["jquery"],
      exports: "Foundation"
    },
    marionette: {
      deps: ["backbone"],
      exports: "Marionette"
    }
  }
});

require(["app", "home_Controller"], function(App, home_Controller){
  App.start();

  $(document).foundation();

  var home_C = new home_Controller();
});
