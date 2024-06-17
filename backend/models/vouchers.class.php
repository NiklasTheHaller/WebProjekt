<?php

class Voucher
{
    public $id;
    public $voucher_code;
    public $expiration_date;
    public $discount_type;
    public $discount_amount;

    public function __construct(int $id, string $voucher_code, string $expiration_date, string $discount_type, int $discount_amount)
    {
        $this->id = $id;
        $this->voucher_code = $voucher_code;
        $this->expiration_date = $expiration_date;
        $this->discount_type = $discount_type;
        $this->discount_amount = $discount_amount;
    }
}
