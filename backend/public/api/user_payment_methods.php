<?php
require_once '../../logic/datahandler.php';
require_once '../../middleware.php';

header('Content-Type: application/json');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

try {
    $dataHandler = new DataHandler();
    $userId = $_SESSION['user_id'];
    $user = $dataHandler->getUserById($userId);

    if ($user) {
        echo json_encode([$user['payment_method']]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
    }
} catch (Exception $e) {
    error_log($e->getMessage());  // Log the error message for debugging
    http_response_code(500);
    echo json_encode(['error' => 'Internal Server Error', 'message' => $e->getMessage()]);
}
