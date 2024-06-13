<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once '../../logic/datahandler.php';

header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Get JSON input
$data = json_decode(file_get_contents('php://input'), true);

$user_id = $_SESSION['user_id'];
$password = trim($data["password"]);

$password_err = "";

// Validate password
if (empty($password)) {
    $password_err = "Please enter your password.";
} else {
    // Verify password
    $dataHandler = new DataHandler();
    $user = $dataHandler->getUserById($user_id);
    if (!$user || !password_verify($password, $user->password)) {
        $password_err = "Incorrect password.";
    }
}

// Check input errors before deleting from database
if (empty($password_err)) {
    if ($dataHandler->deleteUser($user_id)) {
        session_destroy(); // Destroy session after deleting the user
        echo json_encode(['status' => 'success']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete user']);
    }
} else {
    // Return validation errors
    echo json_encode([
        'delete_password_err' => $password_err
    ]);
}
