<?php
// front controller
// delegates which api is used

header('Content-Type: application/json');

$uri = trim($_SERVER['REQUEST_URI'], '/');
$uriSegments = explode('/', $uri);

// Find the position of 'api' in the URI, then get the segment immediately after it
$apiPosition = array_search('api', $uriSegments);
$resource = $uriSegments[$apiPosition + 1] ?? null;

switch ($resource) {
    case 'users':
        require __DIR__ . '/../api/users.php';
        break;
    case 'products':
        require __DIR__ . '/../api/products.php';
        break;
    case 'orders':
        require __DIR__ . '/../api/orders.php';
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Resource not found']);
        break;
}
