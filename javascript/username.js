// login.js

document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get entered username
    const enteredUsername = document.getElementById('username').value.toLowerCase();

    // List of allowed usernames
    const allowedUsernames = [
        'chickenjoe',
        'cinderella',
        'moana',
        'maui',
        'flounder',
        'olaf',
        'grumpy',
        'spongebob',
        'lightningmcqueen',
        'chickhicks'
        // Add more usernames as needed
    ];

    // Check if the entered username is in the allowed list
    const isValidUsername = allowedUsernames.includes(enteredUsername);

    // If the username is valid, redirect to friendlist.html; otherwise, show an alert
    if (isValidUsername) {
        window.location.href = 'friendlist.html';
    } else {
        alert('Invalid username. Please try again.');
    }
});
