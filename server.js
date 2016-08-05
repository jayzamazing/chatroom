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
//keep track of amount of users connected
var usersConnected = 0;
//keep track of userids to names
var users = {};
//attach listener to connection event
io.on('connection', function(socket) {
  //attach listener that will allow user to be assigned a name
  socket.on('join', function(name) {
    //increment usersconnected count
    usersConnected++;
    console.log('Clients connected: ' + usersConnected);
    //add user
    users[socket.id] = name;
    socket.emit('message', 'You are connected to the server.');
    socket.broadcast.emit('message', name + ' has joined the server.')
    io.emit('users', users);
  });
  //attach listener for message event
  socket.on('message', function(message) {
    //log message to the console
    console.log('Received message: ' + message + ' from user: ' + users[socket.id]);
    if (message.user === undefined) {
      //send message to all clients except starting socket
      socket.broadcast.emit('message', users[socket.id] + ': ' + message.message);
    } else {
      socket.to(message.user).emit('message', users[message.user] + ': ' + message.message);
    }
  });
  //send message to users when a user disconnects
  socket.on('disconnect', function() {
    if (usersConnected > 0) {
      usersConnected--;
      console.log('Clients connected: ' + usersConnected);
      if (users[socket.id] !== undefined) {
        socket.broadcast.emit('message', users[socket.id] + ' has disconnected.');
        delete users[socket.id];
      }
      io.emit('users', users);
    }
  });
});
//start server listening on port
server.listen(8080);
