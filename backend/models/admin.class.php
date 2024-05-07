<?php

class admin
{

    public $id;
    public $role;
    public $fk_userid;

    public function __construct($id, $role, $fk_userid)
    {
        $this->id = $id;
        $this->role = $role;
        $this->fk_userid = $fk_userid;
    }
}
