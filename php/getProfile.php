<?php

session_start();
include('./common_funcs.php');
include('./DataClass.php');

SessionCheck();

// まずはプロファイルテーブルからデータ取得
$pdo = db_connect();
$sql = 'SELECT * FROM `Profile`  WHERE `id` = :Id';
$stmt = $pdo->prepare($sql);
$stmt->bindValue(':Id',$_SESSION['login_id'],PDO::PARAM_INT);
$res = $stmt->execute();

if ($res == false){
  $error = $stmt->errorInfo();
 exit('SQL Error:'.$error[2]);
} 

$data = $stmt->fetch(PDO::FETCH_ASSOC);

// ツイート数+リツイート数をゲット。
$sql = "SELECT COUNT(*) FROM `tweet`  WHERE `tw_user_id` = :twUsrId OR `retw_user_id` = :twUsrId";
$stmt = $pdo->prepare($sql);
$stmt->bindValue(':twUsrId',$data['id'],PDO::PARAM_INT);
$stmt->execute();

if ($res == false){
    $error = $stmt->errorInfo();
    exit('SQL Error:'.$error[2]);
}

$twCnt = $stmt->fetch(PDO::FETCH_ASSOC); 


$profile = new ProfileData($data['id'],$data['user_id'],$data['user_name'],null,$data['mail_adrs'],$data['profile_img'],
                            $data['profile_text'], json_decode($data['follow_ids']), json_decode($data['follower_ids']),
                            $data['reg_date'], $data['all_like_count'],$twCnt['COUNT(*)'],count($data['follow_ids']),count($data['follower_ids']));

echo json_encode($profile,JSON_UNESCAPED_UNICODE);
exit();


        

