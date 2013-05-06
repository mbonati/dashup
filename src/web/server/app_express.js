var express = require('express');

var app = require('express')();
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);
app.configure(function(){
  app.use(express.static(__dirname + "/public"));
  app.use(express.static('../client/htdocs'));
  app.use(express.bodyParser());
});

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.listen(process.env.PORT || 3000);

/*
var server = require('http').createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
var io = require('socket.io').listen(server);
*/

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



simpleCounter = 0;
 
io.sockets.on('connection', function (socket) {
  console.log("socket.io connection");
  socket.emit('greetings', { hello: 'Welcome to Dashup!' });
  
  socket.on('my other event', function (data) {
    console.log(data);
  });

  setInterval(function () {
      simpleCounter++;
      socket.volatile.emit('simple-counter', simpleCounter);
  }, 1000);


});

