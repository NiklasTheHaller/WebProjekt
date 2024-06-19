<?php
require_once '../../logic/datahandler.php';

header('Content-Type: application/json');

session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $paymentMethod = $data['payment_method'] ?? null;
    $voucherCode = $data['voucher_code'] ?? null;
    $items = $data['items'] ?? null;
    $voucherAmountRemaining = $data['voucher_amount_remaining'] ?? null;

    if (!$paymentMethod || !$items) {
        http_response_code(400);
        echo json_encode(['error' => 'Payment method and items are required']);
        exit;
    }

    $dataHandler = new DataHandler();
    $userId = $_SESSION['user_id']; // Assuming user is logged in and session contains user_id
    $totalPrice = 0;

    // Calculate total price
    foreach ($items as $item) {
        $product = $dataHandler->getProductByName($item['product_name']);
        if ($product) {
            $item['subtotal'] = $product->product_price * $item['quantity'];
            $totalPrice += $item['subtotal'];
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Product not found: ' . $item['product_name']]);
            exit;
        }
    }

    // Apply voucher if provided
    $discountAmount = 0;
    if ($voucherCode) {
        $voucher = $dataHandler->getVoucherByCode($voucherCode);
        if ($voucher) {
            if ($voucher->discount_type === 'fixed') {
                $discountAmount = $voucher->discount_amount;
                if ($discountAmount > $totalPrice) {
                    // Update voucher amount if it's greater than the total price
                    $remainingAmount = $discountAmount - $totalPrice;
                    $discountAmount = $totalPrice;
                    $dataHandler->updateVoucherAmount($voucherCode, $remainingAmount);
                } else {
                    // Voucher is used up completely
                    $dataHandler->deleteVoucher($voucherCode);
                }
            } elseif ($voucher->discount_type === 'percentage') {
                $discountAmount = $totalPrice * $voucher->discount_amount;
            }
        }
    }

    // Add shipping cost
    $shippingCost = 2.99;
    $totalPrice += $shippingCost;

    // Final total after applying discount
    $finalTotal = max($totalPrice - $discountAmount, 0);

    // Generate unique invoice number
    function generateInvoiceNumber()
    {
        return 'INV-' . strtoupper(uniqid());
    }
    $invoiceNumber = generateInvoiceNumber();

    // Create order
    $orderId = $dataHandler->createOrder([
        'fk_customer_id' => $userId,
        'total_price' => $finalTotal,
        'order_status' => 'Awaiting Payment',
        'order_date' => date('Y-m-d H:i:s'),
        'shipping_address' => $dataHandler->getUserAddress($userId),
        'billing_address' => $dataHandler->getUserAddress($userId),
        'payment_method' => $paymentMethod,
        'shipping_cost' => $shippingCost,
        'tracking_number' => '',
        'discount' => $voucherCode ? $voucherCode : null,
        'invoice_number' => $invoiceNumber // Add invoice number
    ]);

    // Create order items
    foreach ($items as $item) {
        // Fetch the product ID based on the product name for each item
        $product = $dataHandler->getProductByName($item['product_name']);

        if ($product) {
            $dataHandler->createOrderItem([
                'fk_order_id' => $orderId,
                'fk_product_id' => $product->product_id,
                'quantity' => $item['quantity'],
                'subtotal' => $item['subtotal']
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Product not found: ' . $item['product_name']]);
            exit;
        }
    }


    http_response_code(200);
    echo json_encode(['status' => 'success', 'invoice_number' => $invoiceNumber]);
} catch (Exception $e) {
    error_log($e->getMessage());  // Log the error message for debugging
    http_response_code(500);
    echo json_encode(['error' => 'Internal Server Error', 'message' => $e->getMessage()]);
}
