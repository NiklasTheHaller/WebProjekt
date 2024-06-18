<?php
require_once '../../logic/datahandler.php';
require_once '../../middleware.php';

header('Content-Type: application/json');

try {
    $dataHandler = new DataHandler();

    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        if (isset($_GET['product_id'])) {
            // Fetch a single product by ID
            $product = $dataHandler->getProductById($_GET['product_id']);
            if ($product) {
                echo json_encode($product);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Product not found']);
            }
        } else if (isset($_GET['code'])) {
            // Fetch voucher by code
            $voucher = $dataHandler->getVoucherByCode($_GET['code']);
            if ($voucher) {
                echo json_encode([$voucher]);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Voucher not found']);
            }
        } else {
            // Fetch all products
            $products = $dataHandler->getAllProducts();
            echo json_encode($products);
        }
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal Server Error', 'message' => $e->getMessage()]);
}
