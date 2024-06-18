<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$response = [
    'logged_in' => isset($_SESSION['user_id']),
];

echo json_encode($response);
