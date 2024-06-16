<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once '../../logic/datahandler.php';
require_once '../../models/product.class.php';
require_once '../../middleware.php';

checkAdmin();

header('Content-Type: application/json');

$dataHandler = new DataHandler();

$product_id = $_POST['product_id'] ?? null;
$product_name = $_POST['product_name'] ?? null;
$product_description = $_POST['product_description'] ?? null;
$product_price = $_POST['product_price'] ?? null;
$product_weight = $_POST['product_weight'] ?? null;
$product_quantity = $_POST['product_quantity'] ?? null;
$product_category = $_POST['product_category'] ?? null;

if (!$product_id || !$product_name || !$product_description || !$product_price || !$product_weight || !$product_quantity || !$product_category) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required']);
    exit;
}

$change_image = isset($_POST['change_image']) && $_POST['change_image'] === 'true';
$product_imagepath = null;

if ($change_image && isset($_FILES['product_imagepath'])) {
    $product_image = $_FILES['product_imagepath'];

    $target_dir = "../../public/product_images/";
    $target_file = $target_dir . basename($product_image["name"]);
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

    $check = getimagesize($product_image["tmp_name"]);
    if ($check === false) {
        echo json_encode(['error' => 'File is not an image.']);
        exit;
    }

    if (file_exists($target_file)) {
        echo json_encode(['error' => 'File already exists.']);
        exit;
    }

    if ($product_image["size"] > 500000) {
        echo json_encode(['error' => 'Sorry, your file is too large.']);
        exit;
    }

    $allowed_types = ["jpg", "jpeg", "png", "gif"];
    if (!in_array($imageFileType, $allowed_types)) {
        echo json_encode(['error' => 'Sorry, only JPG, JPEG, PNG & GIF files are allowed.']);
        exit;
    }

    if (!move_uploaded_file($product_image["tmp_name"], $target_file)) {
        echo json_encode(['error' => 'Sorry, there was an error uploading your file.']);
        exit;
    }

    $product_imagepath = 'backend/public/product_images/' . basename($product_image["name"]);
} else {
    $existing_product = $dataHandler->getProductById($product_id);
    if ($existing_product) {
        $product_imagepath = $existing_product->product_imagepath;
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Product not found']);
        exit;
    }
}

$product = new Product(
    $product_id,
    $product_name,
    $product_description,
    $product_price,
    $product_weight,
    $product_quantity,
    $product_category,
    $product_imagepath
);

if ($dataHandler->updateProduct($product)) {
    echo json_encode(['status' => 'success']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update product']);
}
