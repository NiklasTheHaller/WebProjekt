<?php
require_once 'session_helper.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function checkAdmin()
{
    if (!isset($_SESSION['user_id']) || !$_SESSION['is_admin']) {
        http_response_code(403);
        echo json_encode(['error' => 'Access denied']);
        exit;
    }
}

function checkAdminRole($requiredRole)
{
    if (!isset($_SESSION['user_id']) || !$_SESSION['is_admin'] || $_SESSION['admin_role'] !== $requiredRole) {
        http_response_code(403);
        echo json_encode(['error' => 'Access denied']);
        exit;
    }
}
