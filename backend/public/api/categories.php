<?php

require_once '../../logic/datahandler.php';

$dataHandler = new DataHandler();
$method = $_SERVER['REQUEST_METHOD'];

header('Content-Type: application/json');

switch ($method) {
    case 'GET':
        $category_id = $_GET['category_id'] ?? null;
        if ($category_id) {
            $category = $dataHandler->getCategoryById($category_id);
            echo json_encode($category);
        } else {
            $categories = $dataHandler->getAllCategories();
            echo json_encode($categories);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
        break;
}
