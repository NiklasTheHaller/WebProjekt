<?php

class Category
{
    public $category_id;
    public $category_name;
    public $category_imagepath;

    public function __construct(int $category_id, string $category_name, string $category_imagepath)
    {
        $this->category_id = $category_id;
        $this->category_name = $category_name;
        $this->category_imagepath = $category_imagepath;
    }
}
