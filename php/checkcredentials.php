<?php
// Assuming your list of friends is stored in an array
$allowedUsernames = ['Chicken Joe', 'Cinderella', 'Moana', 'Maui', 'Flounder', 'Olaf', 'Grumpy', 'Spongebob', 'Lightning McQueen', 'Chick Hicks'];

// Get the submitted credentials from the request
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];

// Check if the username is in the list of allowed usernames
if (in_array($username, $allowedUsernames)) {
    // Valid username
    echo json_encode(['status' => 'success']);
} else {
    // Invalid username
    echo json_encode(['status' => 'error', 'message' => 'Invalid username']);
}
?>
