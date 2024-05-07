<?php

class admin
{

    public $id;
    public $role;
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

    public function __construct($id, $role, $salutation, $firstname, $lastname, $address, $zipcode, $city, $email, $username, $password, $status)
    {
        $this->id = $id;
        $this->role = $role;
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
