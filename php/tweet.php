<?php

session_start();
include('./common_funcs.php');
include('./DataClass.php');
SessionCheck(); 

if (!isset($_POST['tw_text']) || $_POST['tw_text'] == '' ){
    //  ツイート本文がなかったらエラー
    echo 'POST_DATA_ERROR';
    exit();
}

