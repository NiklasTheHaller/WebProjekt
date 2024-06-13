<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once '../../logic/datahandler.php';

header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Get JSON input
$data = json_decode(file_get_contents('php://input'), true);

$user_id = $_SESSION['user_id'];
$title = trim($data["title"]);
$firstname = trim($data["firstname"]);
$lastname = trim($data["lastname"]);
$address = trim($data["address"]);
$zipcode = trim($data["zipcode"]);
$city = trim($data["city"]);
$email = trim($data["email"]);
$username = trim($data["username"]);
$payment_method = trim($data["payment_method"]);

$title_err = $firstname_err = $lastname_err = $address_err = $zipcode_err = $city_err = $email_err = $username_err = $payment_method_err = "";

// Validate title
if (empty($title)) {
    $title_err = "Please enter a title.";
}

// Validate firstname
if (empty($firstname)) {
    $firstname_err = "Please enter your first name.";
}

// Validate lastname
if (empty($lastname)) {
    $lastname_err = "Please enter your last name.";
}

// Validate address
if (empty($address)) {
    $address_err = "Please enter your address.";
}

// Validate zipcode
if (empty($zipcode)) {
    $zipcode_err = "Please enter your zipcode.";
}

// Validate city
if (empty($city)) {
    $city_err = "Please enter your city.";
}

// Validate email
if (empty($email)) {
    $email_err = "Please enter your email.";
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $email_err = "Please enter a valid email.";
} else {
    // Check if email already exists for other users
    $dataHandler = new DataHandler();
    $existingUser = $dataHandler->getUserByEmail($email);
    if ($existingUser && $existingUser->id != $user_id) {
        $email_err = "This email is already taken.";
    }
}

// Validate username
if (empty($username)) {
    $username_err = "Please enter a username.";
} else {
    // Check if username already exists for other users
    $existingUser = $dataHandler->getUserByUsername($username);
    if ($existingUser && $existingUser->id != $user_id) {
        $username_err = "This username is already taken.";
    }
}

// Validate payment method
$valid_payment_methods = ["credit_card", "debit_card", "paypal"];
if (empty($payment_method) || !in_array($payment_method, $valid_payment_methods)) {
    $payment_method_err = "Please select a valid payment method.";
}

// Check input errors before updating in database
if (
    empty($title_err) && empty($firstname_err) && empty($lastname_err) &&
    empty($address_err) && empty($zipcode_err) && empty($city_err) &&
    empty($email_err) && empty($username_err) && empty($payment_method_err)
) {
    $updated_user = new stdClass();
    $updated_user->id = $user_id;
    $updated_user->salutation = $title;
    $updated_user->firstname = $firstname;
    $updated_user->lastname = $lastname;
    $updated_user->address = $address;
    $updated_user->zipcode = $zipcode;
    $updated_user->city = $city;
    $updated_user->email = $email;
    $updated_user->username = $username;
    $updated_user->payment_method = $payment_method;

    if ($dataHandler->updateUserProfile($updated_user)) {
        echo json_encode(['status' => 'success']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update user']);
    }
} else {
    // Return validation errors
    echo json_encode([
        'title_err' => $title_err,
        'firstname_err' => $firstname_err,
        'lastname_err' => $lastname_err,
        'address_err' => $address_err,
        'zipcode_err' => $zipcode_err,
        'city_err' => $city_err,
        'email_err' => $email_err,
        'username_err' => $username_err,
        'payment_method_err' => $payment_method_err
    ]);
}
