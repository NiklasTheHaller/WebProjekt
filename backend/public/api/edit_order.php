<?php
require_once '../../logic/datahandler.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $orderId = $data['order_id'] ?? null;
    $items = $data['items'] ?? null;

    if (!$orderId || !$items) {
        http_response_code(400);
        echo json_encode(['error' => 'Order ID and items are required']);
        exit;
    }

    $dataHandler = new DataHandler();

    foreach ($items as $item) {
        if (isset($item['delete']) && $item['delete'] === true) {
            $dataHandler->deleteOrderItem($item['order_item_id']);
        } else {
            // Fetch product price
            $product = $dataHandler->getProductById($item['fk_product_id']);
            if ($product) {
                $subtotal = $product->product_price * $item['quantity'];
                $item['subtotal'] = $subtotal;
                $dataHandler->updateOrderItem($item);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Product not found for order item ID ' . $item['order_item_id']]);
                exit;
            }
        }
    }

    // Recalculate total price of the order
    $totalPrice = $dataHandler->calculateOrderTotalPrice($orderId);
    $dataHandler->updateOrderTotalPrice($orderId, $totalPrice);

    http_response_code(200);
    echo json_encode(['status' => 'success']);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
}
