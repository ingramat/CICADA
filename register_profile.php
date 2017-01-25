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


$pdo = db_connect();

$sql = 'INSERT INTO `profile` (`id` , `user_id`, `user_name` , `user_pwd` , `mail_adrs`, `profile_img` , `profile_text` , `reg_date` , `all_like_count` )\
        VALUES (null,:usrId,:usrName,:usrPwd,:mailAdrs,:profImg,:profText,sysdate(),0';

$stmt = $pdo->prepair($sql);
$stmt->bindValue(':usrId',$_SESSION['user_id_tmp'],PDO::PARAM_STR);
$stmt->bindValue(':usrName',$_SESSION['user_name_tmp'],PDO::PARAM_STR);
$stmt->bindValue(':usrPwd',password_hash($_SESSION['user_pwd_tmp'],PASSWORD_DEFAULT),PDO::PARAM_STR);
$stmt->bindValue(':mailAdrs',$_SESSION['mail_adrs_tmp'],PDO::PARAM_STR);
$stmt->bindValue(':profImg',$_SESSION['profile_img_tmp'],PDO::PARAM_STR);
$stmt->bindValue(':profText',$_SESSION['profile_text_tmp'],PDO::PARAM_STR);

$res = $stmt->exec();

if ($res == false){
  $error = $stmt->errorInfo();
 exit('SQL Error:'.$error[2]);
} 

echo var_dump($res);

// $_SESSION['profile_id'] = 


// echo json_encode($profile);
exit();