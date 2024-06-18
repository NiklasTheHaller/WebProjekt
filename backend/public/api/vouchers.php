<?php

require_once '../../logic/datahandler.php';
require_once '../../models/vouchers.class.php';
require_once '../../middleware.php';

$dataHandler = new DataHandler();
$method = $_SERVER['REQUEST_METHOD'];

header('Content-Type: application/json');

switch ($method) {
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $voucher_code = $data['voucher_code'];
        $expiration_date = $data['expiration_date'];
        $discount_type = $data['discount_type'];
        $discount_amount = $data['discount_amount'];

        $voucher = new Voucher(0, $voucher_code, $expiration_date, $discount_type, $discount_amount);
        if ($dataHandler->createVoucher($voucher)) {
            echo json_encode(['status' => 'success']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create voucher']);
        }
        break;

    case 'GET':
        $vouchers = $dataHandler->getAllVouchers();
        echo json_encode($vouchers);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
        break;
}
