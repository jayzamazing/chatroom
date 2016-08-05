$(document).ready(function() {
  this.users;
  //create manager object by calling io function
  var socket = io();
  //select input tag
  var input = $('input');
  //get div with messages id
  var messages = $('#messages');
  var usr = $('.users');
  //add message contents to the screen
  var addMessage = function(message) {
    messages.append('<div>' + message + '</div>');
  };
  var updateUsers = function(users) {
    this.users = users;
    usr.empty();
    usr.append('<div>broadcast</div>');
    $.each(users, function(id, name) {
      if ('/#'.concat(socket.id) !== id) {
      usr.append('<div>' + name + '</div>');
    };
  });
  };
  $('.users').on('click', function(event) {
    // $(event.target).css('background-color', 'yellow');
    var temp = $(event.target);
    $.each($('.users > div'), function(index, section) {
      $(section).removeAttr('style');
    });
    $(event.target).css('background-color', 'yellow');
  });
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
    $('#msgfield').val('');
  });
  //add listener for server messages
  socket.on('message', addMessage);
  socket.on('users', updateUsers);
});
