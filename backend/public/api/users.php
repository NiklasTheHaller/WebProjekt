<?php

require_once '../../logic/datahandler.php';

$dataHandler = new DataHandler(); // used to access db
$method = $_SERVER['REQUEST_METHOD'];

header('Content-Type: application/json'); // sets content type to json

switch ($method) {
    case 'GET':
        // Get a user by ID or get all users
        $id = $_GET['id'] ?? null;
        if ($id) {
            $user = $dataHandler->getUserById($id);
            echo json_encode($user);
        } else {
            $users = $dataHandler->getAllUsers();
            echo json_encode($users);
        }
        break;

    case 'POST':
        // Create a new user
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $dataHandler->createUser((object)$data);
        echo json_encode(['result' => $result]);
        break;

    case 'PUT':
        // Update an existing user
        $id = $_GET['id'] ?? null;
        if ($id) {
            $data = json_decode(file_get_contents('php://input'), true);
            $data['id'] = $id;
            $result = $dataHandler->updateUser((object)$data);
            echo json_encode(['result' => $result]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'User ID is required for PUT request']);
        }
        break;

    case 'PATCH':
        // Change user password
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'] ?? null;
        if ($id && isset($data['new_password'])) {
            $hashed_password = password_hash($data['new_password'], PASSWORD_DEFAULT); // Hash the new password
            $result = $dataHandler->changeUserPassword($id, $hashed_password);
            echo json_encode(['result' => $result]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'User ID and new password are required for PATCH request']);
        }
        break;

    case 'DELETE':
        // Delete a user
        $id = $_GET['id'] ?? null;
        if ($id) {
            $result = $dataHandler->deleteUser($id);
            echo json_encode(['result' => $result]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'User ID is required for DELETE request']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
        break;
}
