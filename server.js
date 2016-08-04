//get required modules
var socket_io = require('socket.io');
var http = require('http');
var express = require('express');
//get instance of express
var app = express();
//add static files for express to use
app.use(express.static('public'));
//create http server, allows express to run at same time as socket.io
var server = http.Server(app);
//create sockets
var io = socket_io(server);
//attach listener to connection event
io.on('connection', function(socket) {
  //log message to the console
  console.log('Client connected');
  //attach listener for message event
  socket.on('message', function(message) {
    //log message to the console
    console.log('Received message:', message);
    //send message to all clients except starting socket
    socket.broadcast.emit('message', message);
  });
});

//start server listening on port
server.listen(8080);
