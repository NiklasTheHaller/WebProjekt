<?php

require_once '../../logic/datahandler.php';

$dataHandler = new DataHandler();
$method = $_SERVER['REQUEST_METHOD'];

header('Content-Type: application/json');

switch ($method) {
    case 'GET':
        // Get a product by ID
        $product_id = $_GET['product_id'] ?? null;
        if ($product_id) {
            $product = $dataHandler->getProductById($product_id);
            echo json_encode($product);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Product ID is required for GET request']);
        }
        break;

    case 'POST':
        // Create a new product
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $dataHandler->createProduct((object)$data);
        echo json_encode(['result' => $result]);
        break;

    case 'PUT':
        // Update an existing product
        $product_id = $_GET['product_id'] ?? null;
        if ($product_id) {
            $data = json_decode(file_get_contents('php://input'), true);
            $data['product_id'] = $product_id;
            $result = $dataHandler->updateProduct((object)$data);
            echo json_encode(['result' => $result]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Product ID is required for PUT request']);
        }
        break;

    case 'DELETE':
        // Delete a product
        $product_id = $_GET['product_id'] ?? null;
        if ($product_id) {
            $result = $dataHandler->deleteProduct($product_id);
            echo json_encode(['result' => $result]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Product ID is required for DELETE request']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
        break;
}
