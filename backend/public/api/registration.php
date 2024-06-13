<?php

require_once '../../logic/datahandler.php';
require_once '../../session_helper.php';

header('Content-Type: application/json');

$title = $firstname = $lastname = $address = $zipcode = $city = $email = $username = $password = $confirm_password = $payment_method = "";
$title_err = $firstname_err = $lastname_err = $address_err = $zipcode_err = $city_err = $email_err = $username_err = $password_err = $confirm_password_err = $payment_method_err = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get JSON input
    $data = json_decode(file_get_contents('php://input'), true);
    $title = trim($data["title"]);
    $firstname = trim($data["firstname"]);
    $lastname = trim($data["lastname"]);
    $address = trim($data["address"]);
    $zipcode = trim($data["zipcode"]);
    $city = trim($data["city"]);
    $email = trim($data["email"]);
    $username = trim($data["username"]);
    $password = trim($data["password"]);
    $confirm_password = trim($data["confirm_password"]);
    $payment_method = trim($data["payment_method"]);

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
        // Check if email already exists
        $dataHandler = new DataHandler();
        $existingUser = $dataHandler->getUserByEmail($email);
        if ($existingUser) {
            $email_err = "This email is already taken.";
        }
    }

    // Validate username
    if (empty($username)) {
        $username_err = "Please enter a username.";
    } else {
        // Check if username already exists
        $dataHandler = new DataHandler();
        $existingUser = $dataHandler->getUserByUsername($username);
        if ($existingUser) {
            $username_err = "This username is already taken.";
        }
    }

    // Validate password
    if (empty($password)) {
        $password_err = "Please enter a password.";
    } elseif (strlen($password) < 6) {
        $password_err = "Password must have at least 6 characters.";
    }

    // Validate confirm password
    if (empty($confirm_password)) {
        $confirm_password_err = "Please confirm your password.";
    } elseif ($password !== $confirm_password) {
        $confirm_password_err = "Password did not match.";
    }

    // Validate payment method
    $valid_payment_methods = ["credit_card", "debit_card", "paypal"];
    if (empty($payment_method) || !in_array($payment_method, $valid_payment_methods)) {
        $payment_method_err = "Please select a valid payment method.";
    }

    // Check input errors before inserting in database
    if (
        empty($title_err) && empty($firstname_err) && empty($lastname_err) &&
        empty($address_err) && empty($zipcode_err) && empty($city_err) &&
        empty($email_err) && empty($username_err) && empty($password_err) &&
        empty($confirm_password_err) && empty($payment_method_err)
    ) {

        $hashed_password = password_hash($password, PASSWORD_DEFAULT); // Create a hashed password

        $user = new stdClass();
        $user->salutation = $title;
        $user->firstname = $firstname;
        $user->lastname = $lastname;
        $user->address = $address;
        $user->zipcode = $zipcode;
        $user->city = $city;
        $user->email = $email;
        $user->username = $username;
        $user->password = $hashed_password;
        $user->status = 'active';  // Default status
        $user->payment_method = $payment_method; // Payment method

        if ($dataHandler->createUser($user)) {
            echo json_encode(['status' => 'success']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create user']);
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
            'password_err' => $password_err,
            'confirm_password_err' => $confirm_password_err,
            'payment_method_err' => $payment_method_err
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
}
