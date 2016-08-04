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
  console.log('Client connected');
});

//start server listening on port
server.listen(8080);
