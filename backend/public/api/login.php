<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once '../../session_helper.php';
require_once '../../logic/datahandler.php';

header('Content-Type: application/json');

$email_or_username = $password = "";
$email_or_username_err = $password_err = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents('php://input'), true);
    $email_or_username = trim($data["email_or_username"]);
    $password = trim($data["password"]);
    $remember_me = isset($data["remember_me"]) ? $data["remember_me"] : false;

    if (empty($email_or_username)) {
        $email_or_username_err = "Please enter your email or username.";
    }

    if (empty($password)) {
        $password_err = "Please enter your password.";
    }

    if (empty($email_or_username_err) && empty($password_err)) {
        $dataHandler = new DataHandler();

        $user = $dataHandler->getUserByEmail($email_or_username);

        if (!$user) {
            $user = $dataHandler->getUserByUsername($email_or_username);
        }

        if ($user) {
            if ($user->status === 'inactive') {
                http_response_code(403);
                echo json_encode(['error' => 'Your account is inactive! Please contact the Administrator for help.']);
                exit;
            }

            if (password_verify($password, $user->password)) {
                $_SESSION["user_id"] = $user->id;

                $is_admin = $dataHandler->isAdmin($user->id);
                $_SESSION["is_admin"] = $is_admin;
                $_SESSION["admin_role"] = $is_admin ? $dataHandler->getAdminRole($user->id) : null;

                if ($remember_me) {
                    setcookie("user_id", $user->id, time() + (86400 * 30), "/");
                    setcookie("is_admin", $is_admin, time() + (86400 * 30), "/");
                    setcookie("admin_role", $_SESSION["admin_role"], time() + (86400 * 30), "/");
                }

                echo json_encode([
                    'status' => 'success',
                    'user_id' => $user->id,
                    'is_admin' => $is_admin,
                    'admin_role' => $_SESSION["admin_role"],
                    'message' => 'Login successful'
                ]);
            } else {
                error_log("Password verification failed for user: " . $user->id);
                http_response_code(401);
                echo json_encode(['error' => 'Invalid email/username or password']);
            }
        } else {
            error_log("User not found with email/username: " . $email_or_username);
            http_response_code(401);
            echo json_encode(['error' => 'Invalid email/username or password']);
        }
    } else {
        echo json_encode([
            'email_or_username_err' => $email_or_username_err,
            'password_err' => $password_err
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
}
