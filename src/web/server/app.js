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




/** >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Users DB **/
var users = [
    { id: 1, username: 'admin', password: '*', email: 'admin@dashup.com' }
  , { id: 2, username: 'administrator', password: 'secret', email: 'administrator@dashup.com' }
];

function findById(id, fn) {
  console.log("findById called for "+ id);
  var usersDb  = require("./users.json");
  var idx = id - 1;
  if (usersDb[idx]) {
    fn(null, usersDb[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

function findByUsername(username, fn) {
  console.log("findByUsername called for "+ username);
  var usersDb  = require("./users.json");
  for (var i = 0, len = usersDb.length; i < len; i++) {
    var user = usersDb[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}
/** <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< END Users DB **/







/** >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> LevelUp DB **/
console.log("Loading database...");
var levelup = require('levelup')
// 1) Create our database, supply location and options.
//    This will create or open the underlying LevelDB store.
var db = levelup('./mydb');
console.log("database ready.");
/** <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< END LevelUp DB **/









/** >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Passport **/
var passport = require('passport');
var localPassportStrategy = LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log(">>>>>>>>>>>>>> find user :" + username);
    findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      });
  }
));

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  console.log(">>>>>>>>>>>>>> serialize user :" + user.username);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log(">>>>>>>>>>>>>> deserialize user :" + id);
  findById(id, function (err, user) {
    done(err, user);
  });
});
/** <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< END Passport **/





/** >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Express and Socket.io **/
var io = require('socket.io'),
  express = require('express'),
  app = express();

var sockets = new Array();

var server = require('http').createServer(app);

app.configure(function () {
    app.use(express.logger());
    app.use(logErrors);
    app.use(clientErrorHandler);
    app.use(errorHandler);
    app.use(express.cookieParser());
    app.use(express.session({secret: 'secret', key: 'express.sid'}));
    app.use(express.static('../client/htdocs'));
    app.use(express.bodyParser());
    app.use(passport.initialize());
    app.use(passport.session());
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

// Start server an socket.io listener
var io = io.listen(server);
server.listen(process.env.PORT || 3000);

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


app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login.html'})
);

/** <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< END Express and Socket.io **/






/** >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> REST interface **/
//var express = require('express');
// Make a new Express app
var restfulApp = module.exports = express();
// Use middleware to parse POST data and use custom HTTP methods
restfulApp.use(express.bodyParser());

restfulApp.listen(5000);

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














