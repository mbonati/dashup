/*** WEB Client interface ***/


//http://www.senchalabs.org/connect/
var connect = require('connect');

var app = connect()
  .use(connect.logger('short'))
  .use(connect.static('../client/htdocs'))
  .use(function(req, res){
    res.end('hello world\n');
  })
.listen(process.env.PORT || 3000);


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

  setInterval(function () {
      simpleCounter++;
      socket.volatile.emit('simple-counter', simpleCounter);
  }, 1000);

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
