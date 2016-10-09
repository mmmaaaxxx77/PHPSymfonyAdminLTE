<?php
/**
 * Created by PhpStorm.
 * User: johnnytsai
 * Date: 5/10/16
 * Time: 3:12 PM
 */

namespace AppBundle\Core;


class CusPaginationResponse
{
    public $result;
    public $success;
    public $totalPages;

    public function __construct($success, $totalPages, $result)
    {
        $this->success = $success;
        $this->result = $result;
        $this->totalPages = $totalPages;
    }

}