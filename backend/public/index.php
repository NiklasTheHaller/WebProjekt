<?php
// front controller
// delegates which api is used

header('Content-Type: application/json');

$uri = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
$uriSegments = explode('/', $uri);

// Ensure the 'api' segment exists in the URI
$apiPosition = array_search('api', $uriSegments);
if ($apiPosition === false) {
    http_response_code(404);
    echo json_encode(['error' => 'API segment not found']);
    exit;
}

// Get the resource segment immediately after 'api'
$resource = $uriSegments[$apiPosition + 1] ?? null;

// Define the valid resources and their corresponding files
$validResources = [
    'users' => '/../api/users.php',
    'products' => '/../api/products.php',
    'orders' => '/../api/orders.php',
];

if (isset($validResources[$resource])) {
    require __DIR__ . $validResources[$resource];
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Resource not found']);
}
