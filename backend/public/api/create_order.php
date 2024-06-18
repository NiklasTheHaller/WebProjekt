<?php

require_once '../../logic/datahandler.php';

$dataHandler = new DataHandler();
$order = new stdClass();
$order->fk_customer_id = $_POST['customer_id'];
$order->total_price = $_POST['total_price'];
$order->order_status = 'Pending';
$order->order_date = date('Y-m-d H:i:s');
$order->shipping_address = $_POST['shipping_address'];
$order->billing_address = $_POST['billing_address'];
$order->payment_method = $_POST['payment_method'];
$order->shipping_cost = $_POST['shipping_cost'];
$order->tracking_number = null;
$order->discount = $_POST['discount'];
$order->invoice_number = 'INV-' . uniqid(); // Generate a unique invoice number

$dataHandler->createOrder($order);
