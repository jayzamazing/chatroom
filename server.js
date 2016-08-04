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
  //log message to the console
  console.log('Client connected');
  //increment usersconnected count
  usersConnected++;
  console.log('Users connected: ' + usersConnected);
  //pass message to browser when a user connects
  socket.broadcast.emit('message', 'user connected');
  //attach listener that will allow user to be assigned a name
  socket.on('join', function(name) {
    //add user
    users[socket.id] = name;
    socket.emit("update", "You are connected to the server.");
    socket.broadcast.emit("update", name + " has joined the server.")
    socket.broadcast.emit("update-users", users);

  });
  //attach listener for message event
  socket.on('message', function(message) {
    //log message to the console
    console.log('Received message:', message + 'from user: ' + user[socket.id]);
    //send message to all clients except starting socket
    socket.broadcast.emit("message", users[socket.id], msg);
  });
  //send message to users when a user disconnects
  socket.on('disconnect', function() {
    usersConnected--;
    console.log('Users connected: ' + usersConnected);
    socket.broadcast.emit("update", users[socket.id] + " has disconnected.");
    delete users[socket.id];
    socket.broadcast.emit("update-users", users);
    //send message when a user disconnects
    socket.broadcast.emit('message', 'user disconnected');
  });
});
//start server listening on port
server.listen(8080);
