<?php
session_start();
include('./common_funcs.php');
include('./DataClass.php');
SessionCheck(); 

if (!isset($_POST['retw_text']) || $_POST['retw_text'] == '' ||
    !isset($_POST['tw_id']) || $_POST['tw_id'] == '' ){
    //  ツイート本文がなかったらエラー
    echo 'POST_DATA_ERROR';
    exit();
}

// 入力値をサニタライズ
$retw_text = h($_POST['retw_text']);

// SQLサーバへ接続
$pdo = db_connect();

// まずは、元のツイートを取得
$sql = "SELECT * FROM `tweet` WHERE `id` = :id";

$stmt = $pdo->prepare($sql);
$stmt->bindValue(':id',$_POST['tw_id'],PDO::PARAM_INT);

if ($stmt->execute() == false){
  $error = $stmt->errorInfo();
 exit('SQL Error:'.$error[2]);
} 

$data = $stmt->fetch(PDO::FETCH_ASSOC);


// 次にリツイート登録

$sql = "INSERT INTO `tweet`(`id`, `tw_date`, `tw_user_id`, `tw_text`, `retw_id`, `retw_user_id`, `retw_date`, `retw_text`, `retw_count`, `tw_img`, `like_count`) 
        VALUES (NULL,:twDate,:twUsrId,:twText,:id,:retwUsrId,sysdate(),:retwText,:retwCount,:twImg,:likeCnt)";

$stmt = $pdo->prepare($sql);
$stmt->bindValue(':twDate',$data['tw_date'],PDO::PARAM_STR);
$stmt->bindValue(':twUsrId',$data['tw_user_id'],PDO::PARAM_INT);
$stmt->bindValue(':twText',$data['tw_text'],PDO::PARAM_STR);
$stmt->bindValue(':id',$_POST['tw_id'],PDO::PARAM_INT);
$stmt->bindValue(':retwUsrId',$_SESSION['login_id'],PDO::PARAM_INT);
$stmt->bindValue(':retwText',$retw_text,PDO::PARAM_STR);
$stmt->bindValue(':retwCount',$data['retw_count']+1,PDO::PARAM_INT);
$stmt->bindValue(':twImg',$data['tw_img'],PDO::PARAM_STR);
$stmt->bindValue(':likeCnt',$data['like_count'],PDO::PARAM_INT);


if ($stmt->execute() == false){
  $error = $stmt->errorInfo();
 exit('SQL Error:'.$error[2]);
} 

// 最後に元のツイートのリツイート数を足す。

$sql = "UPDATE `tweet` SET `retw_count`= :retwCnt WHERE `id` = :id";

$stmt = $pdo->prepare($sql);
$stmt->bindValue(':retwCnt',$data['retw_count']+1,PDO::PARAM_INT);
$stmt->bindValue(':id',$_POST['tw_id'],PDO::PARAM_INT);


if ($stmt->execute() == false){
  $error = $stmt->errorInfo();
 exit('SQL Error:'.$error[2]);
} 


echo 'REGISTER_OK';
exit();