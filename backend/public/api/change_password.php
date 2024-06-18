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
$current_password = trim($data["current_password"]);
$new_password = trim($data["new_password"]);

if (empty($current_password) || empty($new_password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Both current and new passwords are required']);
    exit;
}

$user_id = $_SESSION['user_id'];
$dataHandler = new DataHandler();
$user = $dataHandler->getUserById($user_id);

if ($user && password_verify($current_password, $user['password'])) {
    $hashed_new_password = password_hash($new_password, PASSWORD_DEFAULT);
    if ($dataHandler->changeUserPassword($user_id, $hashed_new_password)) {
        echo json_encode(['status' => 'success']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update password']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Incorrect current password']);
}
