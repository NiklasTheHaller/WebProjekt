<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function isAdmin()
{
    return isset($_SESSION['user_id']) && $_SESSION['is_admin'];
}

function getUserRole()
{
    return $_SESSION['admin_role'] ?? null;
}

function requireAdmin()
{
    if (!isAdmin()) {
        http_response_code(403);
        echo json_encode(['error' => 'Access denied']);
        exit;
    }
}

function requireAdminRole($requiredRole)
{
    if (!isAdmin() || getUserRole() !== $requiredRole) {
        http_response_code(403);
        echo json_encode(['error' => 'Access denied']);
        exit;
    }
}
