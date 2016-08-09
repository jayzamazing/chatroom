$(document).ready(function() {
    //variable to hold userid
    var userSelected;
    //empty array to show array of people typing
    var usersTyping = [];
    //create manager object by calling io function
    var socket = io();
    //select input tag
    var input = $('input');
    //get div with messages id
    var messages = $('#messages');
    var usr = $('.users');
    var timeout;
    //add message contents to the screen
    var addMessage = function(message) {
        //add message after all the rest
        messages.append('<div>' + message + '</div>');
    };
    //function to update the users logged in
    var updateUsers = function(users) {
        //empty users list
        usr.empty();
        //always set broadcast as the default when communicating
        usr.append('<div class="highlight">broadcast</div>');
        //iterate through list of users
        $.each(users, function(id, name) {
            //add /# in front of id, compare if both id's are the same
            if ('/#'.concat(socket.id) !== id) {
                //add user to user list
                usr.append('<div data-userid="' + id + '">' + name + '</div>');
            };
        });
    };
    //function to deal with showing people typing
    var setTyping = function(user) {
            //if user is valid
            if (user) {
                //check that user does not exist in array
                if (!usersTyping.includes(user)) {
                    //add item to array
                    usersTyping.push(user);
                }
                //empty users typing list
                $('.typing').empty();
                //iterate over list of people typing
                $.each(usersTyping, function(index, item) {
                    //add users typing to list
                    $('.typing').append(item + ' is typing.');
                });
                //slight timeout if no users are typing
                timeout = setTimeout(function() {
                    //empty list
                    $('.typing').empty();
                }, 5000);
                //otherwise
            } else {
                //empty list
                $('.typing').empty();
            }

        }
        //deals with highlighting user that messages are going to
    $('.users').on('click', function(event) {
        //get the id of the selected user
        userSelected = $(event.target).data('userid');
        //iterate over list of users divs
        $.each($('.users > div'), function(index, section) {
            //remove highlight from list
            $(section).removeClass('highlight');
        });
        //add highlighting to selected item
        $(event.target).addClass('highlight');
    });
    //function to deal with key down in the name field, sets user for session
    $('#namefield').on('keydown', function(event) {
        //if the key is not return
        if (event.keyCode != 13) {
            //exit out
            return;
        }
        //get the value of the name field
        var name = $('#namefield').val();
        //as long as the name field is not empty
        if (name != '') {
            //call socket join and pass it the name
            socket.emit('join', name);
            //disable fields
            $('#namefield').prop('disabled', true);
            $('#msgfield').prop('disabled', false);
            //set focus on the message field
            $('#msgfield').focus();
        }
    });
    //function deals with keypresses in the msgfield, passes who is currently typing
    $('#msgfield').keypress(function(event) {
        //if the key is not return
        if (event.keyCode != 13) {
            ////emit that someone is typing
            socket.emit('typing', true);
            //otherwise
        } else {
            //person pressed enter and message is complete, user is not currently typing
            socket.emit('typing', false);
        }
    });

    //function to listen to keydown when enter is pressed
    $('#msgfield').on('keydown', function(event) {
        //if the key is not return
        if (event.keyCode != 13) {
            //exit out
            return;
        }
        //get the inputs contents
        var message = $('#msgfield').val();
        //call the addmessage function passing the input contents
        addMessage(message);
        //create an object to pass data
        var completeMsg = {
                message: message,
                user: userSelected
            }
            //sends message to socket.io server
        socket.emit('message', completeMsg);

        //empty input
        $('#msgfield').val('');
    });
    //add listener for server messages
    socket.on('message', addMessage);
    socket.on('users', updateUsers);
    socket.on('typing', setTyping);
});
