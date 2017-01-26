<?php

session_start();
include('./common_funcs.php');
//SessionCheck();

if (!isset($_SESSION['hitProfiles']) && !isset($_SESSION['hitTweets'])){
    //検索結果がなければnullをかえす。
    echo null;
    exit();
}

$returnResult= array();
if (isset($_SESSION['hitProfiles'])){
    // プロファイルの検索結果があれば、取り出す。
    $returnResult['hitProfile'] = $_SESSION['hitProfile'];
}

$returnResult= array();
if (isset($_SESSION['hitTweets'])){
    // プロファイルの検索結果があれば、取り出す。
    $returnResult['hitTweets'] = $_SESSION['hitTweets'];
}

echo json_encode($returnResult);
exit();
