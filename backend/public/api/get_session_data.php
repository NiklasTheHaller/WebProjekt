<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    $response = [
        'status' => 'success',
        'user_id' => $_SESSION['user_id'],
        'is_admin' => isset($_SESSION['is_admin']) ? $_SESSION['is_admin'] : false,
        'admin_role' => isset($_SESSION['admin_role']) ? $_SESSION['admin_role'] : null
    ];
    echo json_encode($response);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No active session']);
}
