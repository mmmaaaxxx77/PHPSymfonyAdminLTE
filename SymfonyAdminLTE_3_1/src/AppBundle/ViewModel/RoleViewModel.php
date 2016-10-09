<?php
namespace AppBundle\ViewModel;

class RoleViewModel
{
    public $id;
    public $name;
    public $description;

    public static function toViewModel($data){
        $viewmodel = new RoleViewModel;
        $viewmodel->id = $data->getId();
        $viewmodel->name = $data->getName();
        $viewmodel->description = $data->getDescription();
        return $viewmodel;
    }

    public static function toViewModels($data){
        $arr = array();
        foreach ($data as $key=>$value){
            array_push($arr, RoleViewModel::toViewModel($value));
        }
        return $arr;
    }
}