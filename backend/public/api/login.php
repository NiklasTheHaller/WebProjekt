<?php
session_start(); // Start the session at the beginning

require_once '../../logic/datahandler.php';

header('Content-Type: application/json');

$email_or_username = $password = "";
$email_or_username_err = $password_err = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get JSON input
    $data = json_decode(file_get_contents('php://input'), true);
    $email_or_username = trim($data["email_or_username"]);
    $password = trim($data["password"]);
    $remember_me = isset($data["remember_me"]) ? $data["remember_me"] : false;

    // Validate email or username
    if (empty($email_or_username)) {
        $email_or_username_err = "Please enter your email or username.";
    }

    // Validate password
    if (empty($password)) {
        $password_err = "Please enter your password.";
    }

    // Check input errors before validating the user
    if (empty($email_or_username_err) && empty($password_err)) {
        $dataHandler = new DataHandler();

        // Try to get the user by email
        $user = $dataHandler->getUserByEmail($email_or_username);

        // If not found by email, try by username
        if (!$user) {
            $user = $dataHandler->getUserByUsername($email_or_username);
        }

        // Validate user
        if ($user && password_verify($password, $user->password)) {
            // Set session
            $_SESSION["user_id"] = $user->id;

            if ($remember_me) {
                // Set a cookie for 30 days
                setcookie("user_id", $user->id, time() + (86400 * 30), "/"); // 86400 = 1 day
            }

            echo json_encode(['status' => 'success', 'user_id' => $user->id, 'message' => 'Login successful']);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid email/username or password']);
        }
    } else {
        // Return validation errors
        echo json_encode([
            'email_or_username_err' => $email_or_username_err,
            'password_err' => $password_err
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
}
