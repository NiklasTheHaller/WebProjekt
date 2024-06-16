<?php

class OrderItem
{
    public $order_item_id;
    public $fk_order_id;
    public $fk_product_id;
    public $quantity;
    public $subtotal;

    public function __construct(int $order_item_id, int $fk_order_id, int $fk_product_id, int $quantity, float $subtotal)
    {
        $this->order_item_id = $order_item_id;
        $this->fk_order_id = $fk_order_id;
        $this->fk_product_id = $fk_product_id;
        $this->quantity = $quantity;
        $this->subtotal = $subtotal;
    }
}
