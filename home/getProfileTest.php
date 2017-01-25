<?php

// echo 'start';
// exit();
include('./common_funcs.php');
include('./DataClass.php');
// echo 'include';
// exit();
$pdo = db_connect();
// echo 'db connect';
// exit();

$sql = 'SELECT * FROM `Profile`  WHERE `id` = 2';
// echo $sql;
// exit();
$stmt = $pdo->prepare($sql);
$res = $stmt->execute();

// echo 'res';
// exit();

if ($res == false){
  $error = $stmt->errorInfo();
 exit('SQL Error:'.$error[2]);
}
// echo 'SQL OK';
// exit();
$data = $stmt->fetch(PDO::FETCH_ASSOC);

$profile = new ProfileData($data['id'],$data['user_id'],$data['user_name'],$data['user_pwd'],$data['mail_adrs'],$data['profile_img'],
                           $data['profile_text'],json_decode($data['follow_ids']),json_decode($data['follower_ids']),$data['reg_date'],
                            $data['all_like_count']);


echo json_encode($profile,JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
exit();

