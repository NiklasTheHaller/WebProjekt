<?php

class order
{
    public $order_id;
    public $fk_customer_id;
    public $total_price;
    public $order_status;
    public $order_date;
    public $shipping_address;
    public $billing_address;
    public $payment_method;
    public $shipping_cost;
    public $tracking_number;
    public $discount;

    public function __construct(int $order_id, int $fk_customer_id, float $total_price, string $order_status, string $order_date, string $shipping_address, string $billing_address, string $payment_method, float $shipping_cost, string $tracking_number, string $discount)
    {
        $this->order_id = $order_id;
        $this->fk_customer_id = $fk_customer_id;
        $this->total_price = $total_price;
        $this->order_status = $order_status;
        $this->order_date = $order_date;
        $this->shipping_address = $shipping_address;
        $this->billing_address = $billing_address;
        $this->payment_method = $payment_method;
        $this->shipping_cost = $shipping_cost;
        $this->tracking_number = $tracking_number;
        $this->discount = $discount;
    }
}
