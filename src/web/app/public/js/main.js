require.config({
  paths: {
    jquery: 'jquery/jquery.min',
    underscore: 'underscore/underscore.min',
    backbone: 'backbone/backbone',
    gridster: 'grdister/jquery.gridster.min.js',
    momentjs: 'momentjs/moment.min.js',
  }
});

require([
  // Load our app module and pass it to our definition function
  'app',

], function(App){
  // The "app" dependency is passed in as "App"
  // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
  App.initialize();
});

