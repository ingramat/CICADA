<?php

session_start();
include('./common_funcs.php');
include('./DataClass.php');
SessionCheck();

//とりあえず、セッション変数に情報があるか確認

if (!isset($_SESSION['user_id_tmp']) || !isset($_SESSION['user_name_tmp']) ||
    !isset($_SESSION['mail_adrs_tmp']) || !isset($_SESSION['user_pwd_tmp']) ||
    !isset($_SESSION['profile_text_tmp']) || !isset($_SESSION['profile_img_tmp'])){
        // データがセットされていなかったらエラー
        echo 'NO_REGISTER_INFO';
        exit();
}

$profile = new ProfileData(null,$_SESSION['user_id_tmp'],$_SESSION['user_name_tmp'],$_SESSION['user_pwd_tmp'],$_SESSION['mail_adrs_tmp'],
                           $_SESSION['profile_img'],$_SESSION['profile_text'],$_SESSION['follow_ids'],$_SESSION['follower_ids'],null,0);


echo json_encode($profile);
exit();