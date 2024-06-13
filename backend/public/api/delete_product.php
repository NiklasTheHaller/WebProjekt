<?php
require_once '../../logic/datahandler.php';
require_once '../../middleware.php';

checkAdmin();

$dataHandler = new DataHandler();

header('Content-Type: application/json');

try {
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        if (isset($data['product_id']) && $dataHandler->deleteProduct($data['product_id'])) {
            echo json_encode(['status' => 'success']);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'error' => 'Failed to delete product']);
        }
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal Server Error', 'message' => $e->getMessage()]);
}
