<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once '../../logic/datahandler.php';

header('Content-Type: application/json');


// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    error_log('Unauthorized access attempt');
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$order_id = $_GET['order_id'] ?? null;

if (!$order_id) {
    error_log('Order ID is required');
    http_response_code(400);
    echo json_encode(['error' => 'Order ID is required']);
    exit;
}

$dataHandler = new DataHandler();
$order = $dataHandler->getOrderById($order_id);

if (!$order) {
    error_log("Order not found for ID: $order_id");
    http_response_code(404);
    echo json_encode(['error' => 'Order not found']);
    exit;
}

$orderItems = $dataHandler->getOrderItemsWithProductName($order_id);

echo json_encode([
    'status' => 'success',
    'order' => $order,
    'order_items' => $orderItems
]);
