$(document).ready(function() {
  //create manager object by calling io function
  var socket = io();
  //select input tag
  var input = $('input');
  //get div with messages id
  var messages = $('#messages');
  //add message contents to the screen
  var addMessage = function(message) {
    messages.append('<div>' + message + '</div>');
  };
  $('#namefield').on('keydown', function(event){
    //if the key is not return
    if (event.keyCode != 13) {
      //exit out
      return;
    }
    var name = $('#namefield').val();
    if (name != '') {
      socket.emit('join', name);
      $('#namefield').prop('disabled', true);
      $('#msgfield').prop('disabled', false);
      $('#msgfield').focus();
    }
  });
  //function to listen to keydown when enter is pressed
  $('#msgfield').on('keydown', function(event){
    //if the key is not return
    if (event.keyCode != 13) {
      //exit out
      return;
    }
    //get the inputs contents
    var message = $('#msgfield').val();
    //call the addmessage function passing the input contents
    addMessage(message);
    //sends message to socket.io server
    socket.emit('message', message);
    //empty input
    input.val('');
  });
  //add listener for server messages
  socket.on('message', addMessage);
});
