<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once '../../logic/datahandler.php';
require_once '../../models/product.class.php';
require_once '../../middleware.php';

checkAdmin();

header('Content-Type: application/json');

// Log session information
error_log("Session data: " . print_r($_SESSION, true));

// Check if user is logged in and is an admin
if (!isset($_SESSION['user_id']) || !isset($_SESSION['is_admin']) || !$_SESSION['is_admin']) {
    http_response_code(401);
    error_log("Unauthorized access attempt.");
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Log received input data
error_log("Received POST data: " . print_r($_POST, true));
error_log("Received FILES data: " . print_r($_FILES, true));

// Get input data
$product_name = $_POST['product_name'] ?? null;
$product_description = $_POST['product_description'] ?? null;
$product_price = $_POST['product_price'] ?? null;
$product_weight = $_POST['product_weight'] ?? null;
$product_quantity = $_POST['product_quantity'] ?? null;
$product_category = $_POST['product_category'] ?? null;
$product_image = $_FILES['product_imagepath'] ?? null;

if (!$product_name || !$product_description || !$product_price || !$product_weight || !$product_quantity || !$product_category || !$product_image) {
    http_response_code(400);
    error_log("Validation error: Missing required fields.");
    echo json_encode(['error' => 'All fields are required']);
    exit;
}

// Sanitize input data
$product_name = htmlspecialchars($product_name);
$product_description = htmlspecialchars($product_description);
$product_price = filter_var($product_price, FILTER_VALIDATE_FLOAT);
$product_weight = filter_var($product_weight, FILTER_VALIDATE_FLOAT);
$product_quantity = filter_var($product_quantity, FILTER_VALIDATE_INT);
$product_category = htmlspecialchars($product_category);

// Validate data
if ($product_price === false || $product_weight === false || $product_quantity === false) {
    http_response_code(400);
    error_log("Validation error: Invalid data provided.");
    echo json_encode(['error' => 'Invalid data provided']);
    exit;
}

// Save the image
$target_dir = "../../public/product_images/";
$target_file = $target_dir . basename($product_image["name"]);
$imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

// Log file information
error_log("Target file: " . $target_file);
error_log("Image file type: " . $imageFileType);

// Check if image file is an actual image or fake image
$check = getimagesize($product_image["tmp_name"]);
if ($check === false) {
    error_log("File is not an image.");
    echo json_encode(['error' => 'File is not an image.']);
    exit;
}

// Check if file already exists
if (file_exists($target_file)) {
    error_log("File already exists.");
    echo json_encode(['error' => 'File already exists.']);
    exit;
}

// Check file size
if ($product_image["size"] > 500000) {
    error_log("File is too large.");
    echo json_encode(['error' => 'Sorry, your file is too large.']);
    exit;
}

// Allow certain file formats
$allowed_types = ["jpg", "jpeg", "png", "gif"];
if (!in_array($imageFileType, $allowed_types)) {
    error_log("Invalid file format.");
    echo json_encode(['error' => 'Sorry, only JPG, JPEG, PNG & GIF files are allowed.']);
    exit;
}

// Move the uploaded file to the target directory
if (!move_uploaded_file($product_image["tmp_name"], $target_file)) {
    error_log("Error uploading file.");
    echo json_encode(['error' => 'Sorry, there was an error uploading your file.']);
    exit;
}

$product_imagepath = 'backend/public/product_images/' . basename($product_image["name"]);

$dataHandler = new DataHandler();
$product = new Product(
    0, // Auto-incremented ID
    $product_name,
    $product_description,
    $product_price,
    $product_weight,
    $product_quantity,
    $product_category,
    $product_imagepath
);

if ($dataHandler->createProduct($product)) {
    error_log("Product added successfully: " . print_r($product, true));
    echo json_encode(['status' => 'success']);
} else {
    http_response_code(500);
    error_log("Failed to add product.");
    echo json_encode(['error' => 'Failed to add product']);
}
