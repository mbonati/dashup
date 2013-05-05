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

 
io = require('socket.io').listen(app);
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



