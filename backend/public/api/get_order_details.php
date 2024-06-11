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

$order_id = $_GET['order_id'] ?? null;

if (!$order_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Order ID is required']);
    exit;
}

$dataHandler = new DataHandler();
$order = $dataHandler->getOrderById($order_id);

if ($order) {
    $order_items = $dataHandler->getOrderItemsByOrderId($order_id);
    echo json_encode(['status' => 'success', 'order' => $order, 'order_items' => $order_items]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Order not found']);
}
