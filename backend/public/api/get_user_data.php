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

$user_id = $_SESSION['user_id'];
$dataHandler = new DataHandler();
$user = $dataHandler->getUserById($user_id);
$role = $dataHandler->getAdminRole($user_id);

$mask = isset($_GET['mask']) ? filter_var($_GET['mask'], FILTER_VALIDATE_BOOLEAN) : true;

if ($user) {
    echo json_encode([
        'status' => 'success',
        'user' => [
            'title' => $user['salutation'],
            'firstname' => $user['firstname'],
            'lastname' => $user['lastname'],
            'email' => $mask ? maskEmail($user['email']) : $user['email'],
            'username' => $user['username'],
            'address' => $mask ? maskAddress($user['address']) : $user['address'],
            'zipcode' => $user['zipcode'],
            'city' => $user['city'],
            'payment_method' => $user['payment_method'],
            'role' => $role ? $role : 'Customer'
        ]
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'User not found']);
}

// Function to mask email
function maskEmail($email)
{
    $parts = explode('@', $email);
    $parts[0] = substr($parts[0], 0, 1) . '****' . substr($parts[0], -1);
    return implode('@', $parts);
}

// Function to mask address
function maskAddress($address)
{
    $parts = explode(' ', $address);
    $parts[0] = substr($parts[0], 0, 2) . '***' . substr($parts[0], -1);
    return implode(' ', $parts);
}
