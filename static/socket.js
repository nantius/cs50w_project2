document.addEventListener('DOMContentLoaded', () => {

    // --------------- ADD CHANNEL ---------------------

    // By default, submit button is disabled
    document.querySelector('#add_channel').disabled = true;

    // Enable button only if there is text in the input field
    document.querySelector('#channel_name').onkeyup = () => {
        if (document.querySelector('#channel_name').value.length > 0)
            document.querySelector('#add_channel').disabled = false;
        else
            document.querySelector('#add_channel').disabled = true;
    };

    // --------------- SOCKET IO -------------------------

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // Adding event to the new channel button as soon as socket connects
    // socket.on('connect', () => {
    //     document.querySelector('#add_channel').onclick = () => {
    //         const channel_name = document.querySelector('#channel_name').value;
    //         socket.emit('add channel', {'channel_name': channel_name});
    //     };
    // });

    // When a new channel is created, add to the unordered list
    // socket.on('channel created', data => {
    //     const li = document.createElement('li');
    //     li.innerHTML = data.channel_name;
    //     document.querySelector('#channels').append(li);
    // });

    // --------------------- USER NAME ----------------------

    // Verifying user's storage for username
    if (!localStorage.getItem('name')){
        // if no username is found and the user is trying to access some other page, then redirect him to main page
        if(window.location.href !== "http://127.0.0.1:5000/"){
            window.location.href = "http://127.0.0.1:5000/";
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

});