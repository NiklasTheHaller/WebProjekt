<?php

class admin
{

    public $id;
    public $role;
    public $fk_userid;

    public function __construct(int $id, string $role, int $fk_userid)
    {
        $this->id = $id;
        $this->role = $role;
        $this->fk_userid = $fk_userid;
    }
}
