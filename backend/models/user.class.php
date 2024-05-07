<?php

class user
{

    public $id;
    public $salutation;
    public $firstname;
    public $lastname;
    public $address;
    public $zipcode;
    public $city;
    public $email;
    public $username;
    public $password;
    public $status;

    public function __construct(int $id, string $salutation, string $firstname, string $lastname, string $address, string $zipcode, string $city, string $email, string $username, string $password, bool $status)
    {
        $this->id = $id;
        $this->salutation = $salutation;
        $this->firstname = $firstname;
        $this->lastname = $lastname;
        $this->address = $address;
        $this->zipcode = $zipcode;
        $this->city = $city;
        $this->email = $email;
        $this->username = $username;
        $this->password = $password;
        $this->status = $status;
    }
}
