<?php
namespace AppBundle\Core;

class CusResponse{
    public $result;
    public $success;

    public function __construct($success, $result)
    {
        $this->success = $success;
        $this->result = $result;
    }
}