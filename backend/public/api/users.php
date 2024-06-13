<?php

require_once '../../logic/datahandler.php';

$dataHandler = new DataHandler(); // used to access db
$method = $_SERVER['REQUEST_METHOD'];

header('Content-Type: application/json'); // sets content type to json

switch ($method) {
    case 'GET':
        handleGetRequest($dataHandler);
        break;
    case 'POST':
        handlePostRequest($dataHandler);
        break;
    case 'PUT':
        handlePutRequest($dataHandler);
        break;
    case 'DELETE':
        handleDeleteRequest($dataHandler);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
        break;
}

function handleGetRequest($dataHandler)
{
    $id = $_GET['id'] ?? null;
    if ($id) {
        $user = $dataHandler->getUserById($id);
        if ($user) {
            echo json_encode($user);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'User ID is required for GET request']);
    }
}

function handlePostRequest($dataHandler)
{
    $data = json_decode(file_get_contents('php://input'), true);
    if (validateUserData($data)) {
        $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT); // Hash the password
        $result = $dataHandler->createUser((object)$data);
        echo json_encode(['result' => $result]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid user data']);
    }
}

function handlePutRequest($dataHandler)
{
    $id = $_GET['id'] ?? null;
    if ($id) {
        $data = json_decode(file_get_contents('php://input'), true);
        $data['id'] = $id;
        if (validateUserData($data, false)) { // false indicates it's an update
            $result = $dataHandler->updateUser((object)$data);
            echo json_encode(['result' => $result]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid user data']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'User ID is required for PUT request']);
    }
}

function handleDeleteRequest($dataHandler)
{
    $id = $_GET['id'] ?? null;
    if ($id) {
        $result = $dataHandler->deleteUser($id);
        echo json_encode(['result' => $result]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'User ID is required for DELETE request']);
    }
}

function validateUserData($data, $isNewUser = true)
{
    $requiredFields = ['salutation', 'firstname', 'lastname', 'address', 'zipcode', 'city', 'email', 'username', 'payment_method'];
    if ($isNewUser) {
        $requiredFields[] = 'password';
    }

    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            return false;
        }
    }

    // Additional validation can be added here, e.g., email format, password strength, etc.

    return true;
}
