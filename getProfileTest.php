<?php

include('./common_funcs.php');
include('./DataClass.php');

$pdo = db_connect();

$sql = 'SELECT * FROM `profile`  WHERE `id` = 1';

$stmt = $pdo->prepare($sql);
$res = $stmt->exec();

if ($res == false){
  $error = $stmt->errorInfo();
 exit('SQL Error:'.$error[2]);
} 

$data = $stmt->fetch(PDO::FETCH_ASSOC);

$profile = new ProfileData($data['id'],$data['user_id'],$data['user_name'],$data['user_pwd'],$data['mail_adrs'],$data['profile_img'],
                           $data['profile_text'],json_decode($data['follow_ids']),json_decode($data['follower_ids']),$data['reg_date'],
                            $data['all_like_count']);


echo json_encode($profile);
exit();

