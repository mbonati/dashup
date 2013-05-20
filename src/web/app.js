console.log("DashUp is starting...");


/** >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Banner **/
var sys = require('sys');
var asciimo = require('asciimo').Figlet;
var colors = require('colors'); // add colors for fun

// pick the font file
var font = 'Colossal';
// set text we are writeing to turn into leet ascii art
var text = "Welcome to DashUp";
asciimo.write(text, font, function(art){
          sys.puts(art.green);

});
/** <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< END Banner **/





/** >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Configuration **/
var configuration = require("./app/server/modules/configuration").configuration;
/*
var fs    = require('fs'),
      nconf = require('nconf');
nconf.argv()
  .env()
  .file({ file: './dashup.config.json' });
*/
console.log("Http port: " + configuration.get("http:port"));
console.log("Configuration loaded...");
/** <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< END Configuration **/





/** >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> LevelUp DB **/
/*
console.log("Loading database...");
var levelup = require('levelup')
// 1) Create our database, supply location and options.
//    This will create or open the underlying LevelDB store.
var db = levelup('./app/server/mydb');
console.log("database ready.");
*/
/** <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< END LevelUp DB **/




/** >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Express and Socket.io **/
var io = require('socket.io'),
  express = require('express'),
  app = express();

var sockets = new Array();

var server = require('http').createServer(app);

app.configure(function () {
    app.use(express.logger());
    //app.use(express.logger('dev'));
    app.use(logErrors);
    app.use(clientErrorHandler);
    app.use(errorHandler);
    app.set('views', __dirname + '/app/server/views');
    app.set('view engine', 'jade');
    app.locals.pretty = true;
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'super-duper-secret-secret' }));
    app.use(express.methodOverride());
    app.use(require('stylus').middleware({ src: __dirname + '/app/public' }));
    app.use(express.static(__dirname + '/app/public'));
});

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}


function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.send(500, { error: 'Something blew up!' });
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}

require('./app/server/router')(app);

// Start server an socket.io listener
var io = io.listen(server);
var httpPort = configuration.get("http:port");
server.listen(process.env.PORT || httpPort, function(){
  console.log("DashUp server listening on port " + app.get('port'));
});

io.sockets.on('connection', function (socket) {
  console.log("socket.io connection");
  sockets.push(socket);
  socket.emit('greetings', { hello: 'Welcome to Dashup!' });

  /*
  socket.on('my other event', function (data) {
    console.log(data);
  });
  */
  /*
  setInterval(function () {
      simpleCounter++;
      socket.volatile.emit('simple-counter', simpleCounter);
  }, 1000);
  */

  function sendUpdate(data){
   socket.emit('updateValue.' + data.wid, data);
  }

});

function sendUpdateValue(socket, data){
  sendSignal(socket, 'updateValue.' + data.wid, data);
}

function sendSignal(socket,signalName, data){
  console.log("emitting signal for " + signalName);
  socket.emit(signalName, data);
}

/** <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< END Express and Socket.io **/






/** >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> REST interface **/
//var express = require('express');
// Make a new Express app
var restfulApp = module.exports = express();
// Use middleware to parse POST data and use custom HTTP methods
restfulApp.use(express.bodyParser());

var restPort = configuration.get("REST:port");
restfulApp.listen(restPort);
console.log("REST interface listening on port "+restPort);

restfulApp.post('/sayHello', function (request, response) {
  console.log("tasks called " + request.body.wid);
    response.json({msg: 'Hello ' + request.body.wid});
});

restfulApp.post('/updateValue', function (request, response) {
  console.log("updateValue body '" + JSON.stringify(request.body)+"'");
  console.log("updateValue called for " + request.body.wid);
  if (updateValue(request.body)){
      response.json({result: 'OK'});
  } else {
      response.json({result: 'NOK'});
  }
});

function updateValue(data){
  for (i=0;i<sockets.length;i++){
    console.log("emitting update for " + JSON.stringify(data));
    sendUpdateValue(sockets[i], data);
    /*
    var signalName = 'updateValue.'+data.wid;
    sockets[i].emit(signalName, data);
    */
  }
  return true;
}
/** <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< END REST interface **/














