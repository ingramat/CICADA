<?php
session_start();
include('./common_funcs.php');
include('./DataClass.php');
SessionCheck(); 

if (!isset($_POST['tw_text']) || $_POST['tw_text'] == '' ||
    !isset($_POST['id']) || $_POST['id'] == '' ){
    //  ツイート本文がなかったらエラー
    echo 'POST_DATA_ERROR';
    exit();
}

// 入力値をサニタライズ
$tw_text = h($_POST['tw_text']);




$sql = "INSERT INTO `tweet`(`id`, `tw_date`, `tw_user_id`, `tw_text`, `retw_id`, `retw_user_id`, `retw_date`, `retw_count`, `tw_img`, `like_count`)
             VALUES (NULL,sysdate(),:uId,:twText,NULL,0,'1000-01-01 00:00:00',0,NULL,0)";


// SQLサーバへ接続
$pdo = db_connect();

$stmt = $pdo->prepare($sql);
$stmt->bindValue(':uId',$_SESSION['login_id'],PDO::PARAM_INT);
$stmt->bindValue(':twText',$tw_text,PDO::PARAM_STR);
// 画像があるならバインド

if (isset($upload_file) && $upload_file != '') $stmt->bindValue(':twImg',$upload_file,PDO::PARAM_STR); 

if ($stmt->execute() == false){
  $error = $stmt->errorInfo();
 exit('SQL Error:'.$error[2]);
} 

echo 'REGISTER_OK';
exit();