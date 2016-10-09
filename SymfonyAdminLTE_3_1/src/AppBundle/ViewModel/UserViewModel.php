<?php
namespace AppBundle\ViewModel;

class UserViewModel
{
    public $id;
    public $email;
    public $username;
    public $isActive;
    public $lastLogin;
    public $createDate;
    public $updateDate;
    public $online;

    public static function toViewModel($data){
        $viewmodel = new UserViewModel;
        $viewmodel->id = $data->getId();
        $viewmodel->email = $data->getEmail();
        $viewmodel->username = $data->getUsername();
        $viewmodel->isActive = $data->getIsActive();
        if($data->getLastLogin() != null)
            $viewmodel->lastLogin = $data->getLastLogin()->getTimestamp();
        else
            $viewmodel->lastLogin = $data->getLastLogin();
        $viewmodel->createDate = $data->getCreateDate()->getTimestamp();
        $viewmodel->updateDate = $data->getUpdateDate()->getTimestamp();
        $viewmodel->online = $data->getOnline();

        return $viewmodel;
    }

    public static function toViewModels($data){
        $arr = array();
        foreach ($data as $key=>$value){
            array_push($arr, UserViewModel::toViewModel($value));
        }
        return $arr;
    }
}