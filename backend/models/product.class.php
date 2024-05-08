<?php

class product
{
    public $product_id;
    public $product_name;
    public $product_description;
    public $product_price;
    public $product_weight;
    public $product_quantity;
    public $product_category;
    public $product_imagepath;

    public function __construct($product_id, $product_name, $product_description, $product_price, $product_weight, $product_quantity, $product_category, $product_imagepath)
    {
        $this->product_id = $product_id;
        $this->product_name = $product_name;
        $this->product_description = $product_description;
        $this->product_price = $product_price;
        $this->product_weight = $product_weight;
        $this->product_quantity = $product_quantity;
        $this->product_category = $product_category;
        $this->product_imagepath = $product_imagepath;
    }
}
