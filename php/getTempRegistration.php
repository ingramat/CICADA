<?php

session_start();
include('./common_funcs.php');
include('./DataClass.php');

if ($_SESSION['user_id_tmp']){
    $profile = new Profile(null,$_SESSION['user_id_tmp'],$_SESSION['user_name_tmp'],$_SESSION['user_pwd_tmp'],$_SESSION['mail_adrs_tmp'],
                           $_SESSION['profile_img_tmp'],$_SESSION['profile_text_tmp'],[],[],null,0);

    echo json_encode($profile,JSON_UNESCAPED_UNICODE);
    exit();
} else {
    echo 'NO_SESSION_DATA';
    exit();
}
