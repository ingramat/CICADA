<?php

session_start();
include('./common_funcs.php');
include('./DataClass.php');
SessionCheck(); 

if (!isset($_GET['follow_id']) || $_GET['follow_id'] == '' ){
    //  ツイート本文がなかったらエラー
    echo 'POST_DATA_ERROR';
    exit();
}

// 入力値をサニタライズ
$tw_text = h($_GET['follow_id']);
// int型で格納
$addId = intval($_GET['follow_id']);


// フォローかアンフォローかのふらぐ
$isFollow = true;

// SQLサーバへ接続
$pdo = db_connect();

// まずは、現状のフォロー配列を取ってくる

// sqlの作成
$sql = "SELECT `follow_ids`, FROM `Profile` WHERE `id` = :id";

$stmt = $pdo->prepare($sql);
$stmt->bindValue(':id',$_SESSION['login_id'],PDO::PARAM_INT);

if ($stmt->execute() == false){
  $error = $stmt->errorInfo();
 exit('SQL Error:'.$error[2]);
}

$data = $stmt->fetch(PDO::FETCH_ASSOC);
$follow_ids = json_decode($data['follow_ids']);

// 今までなければフォロー配列追加
if ( in_array($addId,$follow_ids,true)) {
    array_push($follow_ids,$addId);
    $isFollow = true;
} else {
    // すでにフォローしているのであればフォロー解除
    $findex = array_search($addId,$follow_ids);
    array_splice($follow_ids,$findex,1);
    $isFollow = false;
}

// 追加した配列をアップデート
$sql = "UPDATE `Profile` SET `follow_ids`=:flwIds WHERE `id` = :id";

$stmt = $pdo->prepare($sql);
$stmt->bindValue(':flwIds',json_encode($follow_ids),PDO::PARAM_STR);
$stmt->bindValue(':id',$_SESSION['login_id'],PDO::PARAM_INT);

if ($stmt->execute() == false){
  $error = $stmt->errorInfo();
 exit('SQL Error:'.$error[2]);
}


// フォローされた側のフォロワーに追加/削除

$sql = "SELECT `follower_ids`, FROM `Profile` WHERE `id` = :id";

$stmt = $pdo->prepare($sql);
$stmt->bindValue(':id',$addId,PDO::PARAM_INT);

if ($stmt->execute() == false){
  $error = $stmt->errorInfo();
 exit('SQL Error:'.$error[2]);
}

$data = $stmt->fetch(PDO::FETCH_ASSOC);
$follower_ids = json_decode($data['follower_ids']);

// 今までなければフォロー配列追加
if (!in_array($_SESSION['login_id'],$follower_ids,true)){
    array_push($follower_ids,$_SESSION['login_id']);
    $isFollow = true;
} else {
    // すでにフォローされているのであれば削除
    $findex = array_search($addId,$follower_ids);
    array_splice($follower_ids,$findex,1);
    $isFollow = false;
}

// 追加した配列をアップデート
$sql = "UPDATE `Profile` SET `follower_ids`=:flwerIds WHERE `id` = :id";

$stmt = $pdo->prepare($sql);
$stmt->bindValue(':flwerIds',json_encode($follower_ids),PDO::PARAM_STR);
$stmt->bindValue(':id',$addId,PDO::PARAM_INT);

if ($stmt->execute() == false){
  $error = $stmt->errorInfo();
 exit('SQL Error:'.$error[2]);
}

if ($isFollow){
    echo 'FOLLOW_OK';
    exit();
} else {
    echo 'UNFOLLOW_OK';
    exit();
}

