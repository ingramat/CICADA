<?php

session_start();
include('./common_funcs.php');
include('./DataClass.php');
SessionCheck();

// SQL からTweetを取得する。
$pdo = db_connect();
$stmt = null;

$limit = 20;

if (!isset($_GET['index']) || $_GET['index'] == '' ){
    // インデックスが来てないならエラー
    echo 'GET_NO_INDEX';
    exit();
}

$index = intval($_GET['index']);

 if (isset($_GET['follow']) && $_GET['follow'] !== ''){
//     // フォローと自分のツイートを取得する場合は

// echo $_GET['follow'];
// exit();

    $sql = "SELECT `tweet`.`id`, `tw_date`, `tw_user_id`, `tw_text`, `retw_id`, `retw_user_id`, `retw_date`, `retw_count`, `tw_img`, `like_count`,
     `t_user`.`user_name` AS `tw_user_name`,
     `t_user`.`user_id` AS `tw_user_usrId`,
     `t_user`.`profile_img` AS `tw_profile_img`, 
     (CASE `tweet`.`retw_user_id` 
        WHEN NULL THEN NULL 
        ELSE (SELECT `user_name` FROM `Profile` WHERE `tweet`.`retw_user_id`=`Profile`.`id`) 
     END) AS `retw_user_name`, 
     (CASE `tweet`.`retw_user_id` 
        WHEN NULL THEN NULL 
        ELSE (SELECT `user_id` FROM `Profile` WHERE `tweet`.`retw_user_id`=`Profile`.`id`) 
     END) AS `retw_user_usrId`, 
     (CASE `tweet`.`retw_user_id` 
        WHEN NULL THEN NULL 
        ELSE (SELECT `profile_img` FROM `Profile` WHERE `tweet`.`retw_user_id`=`Profile`.`id`) 
     END) AS `retw_profile_img`, 
     (CASE 
        WHEN `tweet`.`tw_date` > `tweet`.`retw_date` THEN `tweet`.`tw_date` 
        ELSE `tweet`.`retw_date` 
     END) AS `latest_date` 
     FROM (`tweet` JOIN `Profile` AS `t_user` ON `tweet`.`tw_user_id` = `t_user`.`id`) 
     WHERE (`tweet`.`tw_user_id` IN ( ";

//  echo(count(json_decode($_GET['follow'])));
//  exit();
    //  $follow_ids = array();
    //  $follow_ids = json_decode($_GET['follow']);
    //  自分のID分を追加する。
    $follows = json_decode($_GET['follow']);

    // echo var_dump($follows);
    // exit();
    // echo(count(json_decode($_GET['follow'])));
     $len = count(json_decode($_GET['follow'])) +1;

    //  echo $len;
    //  exit();

     for ($i=0; $i < $len; $i++){
         $sql = $sql . ":fId$i, ";
     }
    //  最後の ', 'を削除
     $sql = substr($sql,0,-2);

     $sql = $sql . " ) AND `tweet`.`retw_user_id` = 0 ) OR `tweet`.`retw_user_id`  IN ( ";

     for ($i=0; $i < $len; $i++){
         $sql = $sql . ":fId$i, ";
     }
     //  最後の ', 'を削除
     $sql = substr($sql,0,-2);

     $sql = $sql. ")
     ORDER BY `latest_date` DESC
     LIMIT :start, :numLimit";

    //  echo($sql);
    //  exit();

    $stmt = $pdo->prepare($sql);

    for ($i=0; $i < $len; $i++){

        // まずはフォローを格納
        if($i < $len -1)    $stmt->bindValue(":fId$i",$follows[$i],PDO::PARAM_INT);
        // 最後に自分のIDを格納
        else    $stmt->bindValue(":fId$i",$_SESSION['login_id'],PDO::PARAM_INT);
    }

} else {
    // フォローのツイートじゃない場合は、自分のツイートを取得
    
    $sql = "SELECT `tweet`.`id`, `tw_date`, `tw_user_id`, `tw_text`, `retw_id`, `retw_user_id`, `retw_date`, `retw_count`, `tw_img`, `like_count`,
     `t_user`.`user_name` AS `tw_user_name`,
     `t_user`.`user_id` AS `tw_user_usrId`,
     `t_user`.`profile_img` AS `tw_profile_img`, 
     (CASE `tweet`.`retw_user_id` 
        WHEN NULL THEN NULL 
        ELSE (SELECT `user_name` FROM `Profile` WHERE `tweet`.`retw_user_id`=`Profile`.`id`) 
     END) AS `retw_user_name`,
     (CASE `tweet`.`retw_user_id` 
        WHEN NULL THEN NULL 
        ELSE (SELECT `user_id` FROM `Profile` WHERE `tweet`.`retw_user_id`=`Profile`.`id`) 
     END) AS `retw_user_usrId`, 
     (CASE `tweet`.`retw_user_id` 
        WHEN NULL THEN NULL 
        ELSE (SELECT `profile_img` FROM `Profile` WHERE `tweet`.`retw_user_id`=`Profile`.`id`) 
     END) AS `retw_profile_img`, 
     (CASE 
        WHEN `tweet`.`tw_date` > `tweet`.`retw_date` THEN `tweet`.`tw_date` 
        ELSE `tweet`.`retw_date` 
     END) AS `latest_date` 
     FROM (`tweet` JOIN `Profile` AS `t_user` ON `tweet`.`tw_user_id` = `t_user`.`id`) 
     WHERE (`tweet`.`tw_user_id` = :usrId AND `tweet`.`retw_user_id` = 0 ) OR `tweet`.`retw_user_id` = :usrId 
     ORDER BY `latest_date` DESC
     LIMIT :start, :numLimit";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':usrId',$_SESSION['login_id'],PDO::PARAM_INT);
    
 }

 $stmt->bindValue(':start',$index,PDO::PARAM_INT);
 $stmt->bindValue(':numLimit',$limit,PDO::PARAM_INT);


 if ($stmt->execute()== false){
    $error = $stmt->errorInfo();
    exit('SQL Error:'.$error[2]);
}

$tweets = array();
$cnt = 0;

while ($data = $stmt->fetch(PDO::FETCH_ASSOC)){

    $tweets[$cnt] = new Tweet($data['id'],$data['tw_date'],$data['tw_user_id'],$data['tw_text'],
                        $data['retw_id'],$data['retw_user_id'],$data['retw_date'],$data['retw_count'],$data['tw_img'],
                        $data['like_count'],$data['tw_user_name'],$data['tw_user_usrId'],$data['tw_profile_img'],
                        $data['retw_user_name'],$data['retw_user_usrId'],$data['retw_profile_img']);

    $cnt++;
}

$is_end = false;
if ($cnt < 20) $is_end = true;
$index += $cnt;

$tweetData = new TweetData($tweets,$index,$is_end);

echo json_encode($tweetData,JSON_UNESCAPED_UNICODE);
exit();
