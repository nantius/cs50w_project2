document.addEventListener('DOMContentLoaded', () => {

    // --------------------- USER NAME ----------------------

    // Verifying user's storage for username
    if (!localStorage.getItem('name')){
        // if no username is found and the user is trying to access some other page, then redirect him to main page
        if(window.location.pathname !== "/"){
            window.location.pathname = "/";
        } else {
            // Query user for username
            const username = prompt("Insert your username");
            // Store username
            localStorage.setItem('name', username);
        }
    }

    // Create and display username tag
    const name = document.createElement('p');
    name.innerHTML = localStorage.getItem('name');
    document.querySelector('#user_name').append(name);

    // --------------- ADD CHANNEL ---------------------

    if(window.location.pathname === "/"){
        // By default, submit button is disabled
        document.querySelector('#add_channel').disabled = true;

        // Enable button only if there is text in the input field
        document.querySelector('#channel_name').onkeyup = () => {
        if (document.querySelector('#channel_name').value.length > 0)
            document.querySelector('#add_channel').disabled = false;
        else
            document.querySelector('#add_channel').disabled = true;
        };
    }

    // --------------- ADD MESSAGE ---------------------

    if(window.location.pathname !== "/"){
        // By default, submit button is disabled
        document.querySelector('#add_message').disabled = true;

        // Enable button only if there is text in the input field
        document.querySelector('#message').onkeyup = () => {
        if (document.querySelector('#message').value.length > 0)
            document.querySelector('#add_message').disabled = false;
        else
            document.querySelector('#add_message').disabled = true;
        };
    }

    // --------------- SOCKET IO -------------------------

    if(window.location.pathname !== "/"){

        // Connect to websocket
        var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

        // Adding event to the new channel button as soon as socket connects
        socket.on('connect', () => {
            document.querySelector('#add_message').onclick = () => {

                // Creating the message object to send to server
                const user_message = document.querySelector('#message').value;

                const name = localStorage.getItem('name');

                const time = new Date();
                const time_string = time.getHours() + ':' + time.getMinutes() + ' - ' + time.getDay() + '/' + time.getMonth();

                const message = {'message': user_message, 'time': time_string, 'user': name};

                const channel_header = document.querySelector('#channel_header').getAttribute('data-name');

                socket.emit('add message', {'message': message, 'channel': channel_header});
            };
        });

        // When a new message is created, add to the unordered list
        socket.on('message created', data => {
            const li = document.createElement('li');
            li.innerHTML = data.message.message + ' by ' + data.message.user + ' at ' + data.message.time;
            document.querySelector('#messages').append(li);
        });

    }

});