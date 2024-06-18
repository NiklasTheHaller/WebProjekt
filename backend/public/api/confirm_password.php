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
$password = trim($data["password"]);

if (empty($password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Password is required']);
    exit;
}

$user_id = $_SESSION['user_id'];
$dataHandler = new DataHandler();
$user = $dataHandler->getUserById($user_id);

if ($user && password_verify($password, $user['password'])) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Incorrect password']);
}
