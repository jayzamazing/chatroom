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
        //show how many users are connected in the console
        console.log('Clients connected: ' + usersConnected);
        //add user
        users[socket.id] = name;
        //let the user know they connected
        socket.emit('message', 'You are connected to the server.');
        //tell everyone who is connected that the user just joined
        socket.broadcast.emit('message', name + ' has joined the server.')
            //send out list of currently connected users
        io.emit('users', users);
    });
    //attach listener for message event
    socket.on('message', function(message) {
        //log message to the console
        console.log('Received message: ' + message + ' from user: ' + users[socket.id]);
        //if user is undefined
        if (message.user === undefined) {
            //send message to all clients except starting socket
            socket.broadcast.emit('message', users[socket.id] + ': ' + message.message);
            //otherwise
        } else {
            //send message to specific user
            socket.to(message.user).emit('message', users[message.user] + ': ' + message.message);
        }
    });
    //send message to users when a user disconnects
    socket.on('disconnect', function() {
        //only perform if there are users attached
        if (usersConnected > 0) {
            //decrement users connected
            usersConnected--;
            //log users connected
            console.log('Clients connected: ' + usersConnected);
            //as long as user disconnecting is valid
            if (users[socket.id] !== undefined) {
                //tell everyone that user is disconnecting
                socket.broadcast.emit('message', users[socket.id] + ' has disconnected.');
                //remove user from list
                delete users[socket.id];
            }
            //send out list of current users connected
            io.emit('users', users);
        }
    });
    //when typing is emitted, respond with the following
    socket.on('typing', function(typing) {
        //as long as user is valid
        if (users[socket.id] !== 'undefined') {
            //if typing is true
            if (typing) {
                //broadcast that user is typing
                socket.broadcast.emit('typing', users[socket.id]);
                //otherwise
            } else {
                //send that noone is typing
                socket.broadcast.emit('typing', null);
            }
        }
    });
});
//start server listening on port
server.listen(8080);
