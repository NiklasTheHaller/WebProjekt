<?php
require_once '../../logic/datahandler.php';

header('Content-Type: application/json');

$dataHandler = new DataHandler();
$orders = $dataHandler->getAllOrders();

echo json_encode($orders);
