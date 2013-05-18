/*** WEB Client interface ***/

/** Banner */
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


console.log("DashUp is starting...");

/** LevelUp DB **/
console.log("Loading database...");
var levelup = require('levelup')
// 1) Create our database, supply location and options.
//    This will create or open the underlying LevelDB store.
var db = levelup('./mydb');
console.log("database ready.");


/*
// 2) put a key & value
db.put('name', 'LevelUP', function (err) {
  if (err) {
    return console.log('Ooops!', err) // some kind of I/O error
  }
});
*/

/*
// 3) fetch by key
db.get('name', function (err, value) {
  if (err) {
    return console.log('Ooops!', err) // likely the key was not found
  } else {
    // ta da!
    console.log('Result: name=' + value)
  }
});
*/





/** Connect middleware **/
//http://www.senchalabs.org/connect/
var connect = require('connect');

var app = connect()
  .use(connect.logger('dev'))
  .use(connect.favicon())
  .use(connect.cookieParser("keyboard cat"))
  .use(connect.session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))  
  .use(connect.static('../client/htdocs'))
  .use(function(req, res, next){
    var session = req.session;
    console.log(">>>>>>>>>>>>>" + JSON.stringify(session));
    if (session.views){
      session.views++;
    } else {
      session.views = 1;
    }
    console.log(">>>>>>>>>>>>>views: " + session.views);
    res.end('Welcome to Dashup!\n');
  })
.listen(process.env.PORT || 3000);






/** Realtime socket.io **/
simpleCounter = 0;


var sockets = new Array();
io = require('socket.io').listen(app);
io.sockets.on('connection', function (socket) {
  console.log("socket.io connection");
  
  sockets.push(socket);

  socket.emit('greetings', { hello: 'Welcome to Dashup!' });
  
  socket.on('my other event', function (data) {
    console.log(data);
  });

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




/*** REST interface ***/
var express = require('express');
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
		var signalName = 'updateValue.'+data.wid;
		console.log("emitting signal for " + signalName);
		sockets[i].emit(signalName, data);
	}
	return true;
}
