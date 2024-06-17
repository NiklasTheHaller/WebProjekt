<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once '../../logic/datahandler.php';
require_once '../../models/user.class.php';
require_once '../../middleware.php';

checkAdmin();

header('Content-Type: application/json');

$dataHandler = new DataHandler();

$action = $_POST['action'] ?? null;

if ($action === 'update_user') {
    $user_id = $_POST['user_id'] ?? null;
    $user_salutation = $_POST['user_salutation'] ?? null;
    $user_firstname = $_POST['user_firstname'] ?? null;
    $user_lastname = $_POST['user_lastname'] ?? null;
    $user_address = $_POST['user_address'] ?? null;
    $user_zipcode = $_POST['user_zipcode'] ?? null;
    $user_city = $_POST['user_city'] ?? null;
    $user_email = $_POST['user_email'] ?? null;
    $user_username = $_POST['user_username'] ?? null;
    $user_password = $_POST['user_password'] ?? null;
    $user_payment_method = $_POST['user_payment_method'] ?? null;
    $user_status = $_POST['user_status'] ?? null;

    if (!$user_id || !$user_salutation || !$user_firstname || !$user_lastname || !$user_address || !$user_zipcode || !$user_city || !$user_email || !$user_username || !$user_password || !$user_payment_method || $user_status === null) {
        http_response_code(400);
        echo json_encode(['error' => 'All fields are required']);
        exit;
    }

    $user = new User(
        $user_id,
        $user_salutation,
        $user_firstname,
        $user_lastname,
        $user_address,
        $user_zipcode,
        $user_city,
        $user_email,
        $user_username,
        $user_password,
        $user_payment_method,
        $user_status
    );

    if ($dataHandler->updateUser($user)) {
        echo json_encode(['status' => 'success']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update user']);
    }
} elseif ($action === 'set_status') {
    $user_id = $_POST['user_id'] ?? null;
    $user_status = $_POST['status'] ?? null;

    if (!$user_id || $user_status === null) {
        http_response_code(400);
        echo json_encode(['error' => 'User ID and status are required']);
        exit;
    }

    if ($dataHandler->setUserStatus($user_id, $user_status)) {
        echo json_encode(['status' => 'success']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to set user status']);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid action']);
}
