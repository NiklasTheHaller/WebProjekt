<?php

require_once '../../logic/datahandler.php';

header('Content-Type: application/json');

session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Get JSON input
$data = json_decode(file_get_contents('php://input'), true);

$user_id = $_SESSION['user_id'];
$current_password = trim($data["current_password"]);
$new_password = trim($data["new_password"]);
$confirm_new_password = trim($data["confirm_new_password"]);

$current_password_err = $new_password_err = $confirm_new_password_err = "";

// Validate current password
if (empty($current_password)) {
    $current_password_err = "Please enter your current password.";
} else {
    // Verify current password
    $dataHandler = new DataHandler();
    $user = $dataHandler->getUserById($user_id);
    if (!$user || !password_verify($current_password, $user->password)) {
        $current_password_err = "Incorrect current password.";
    }
}

// Validate new password
if (empty($new_password)) {
    $new_password_err = "Please enter a new password.";
} elseif (strlen($new_password) < 6) {
    $new_password_err = "New password must have at least 6 characters.";
}

// Validate confirm new password
if ($new_password !== $confirm_new_password) {
    $confirm_new_password_err = "Passwords do not match.";
}

// Check input errors before updating in database
if (empty($current_password_err) && empty($new_password_err) && empty($confirm_new_password_err)) {
    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

    if ($dataHandler->updateUserPassword($user_id, $hashed_password)) {
        echo json_encode(['status' => 'success']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update password']);
    }
} else {
    // Return validation errors
    echo json_encode([
        'current_password_err' => $current_password_err,
        'new_password_err' => $new_password_err,
        'confirm_new_password_err' => $confirm_new_password_err
    ]);
}
