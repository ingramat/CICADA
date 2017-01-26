<?php

session_start();
include('./common_funcs.php');
//SessionCheck();

if (!isset($_SESSION['profile'])){
    //プロファイルデータがまだ取得されていない時はnullを返す。
    echo null;
    exit();
}

$usr_id = $_SESSION['profile']['user_id'];
$follow_ids = $_SESSION['profile']['follow_ids']; //DBから取得した時にJSONからパースしておく

// SQL からフォローのTweetを取得する。
$pdo = db_connect();

$sql = 'SELECT * FROM `tweet`  WHERE `tw_user_id`  IN () OR `retw_id` IN ()';

for ($i = 0, $len = $follo_ids.length; $i < $len; $i++){
    $sql +=  $follo_ids[$i] . ', ';
}

$sql =   //最後のカンマを削除
$sql += ')';

$stmt = $pdo->prepair($sql);
$res = $stmt->exec();

if ($res == false){
  $error = $stmt->errorInfo();
 exit('SQL Error:'.$error[2]);
}

$follow_tweets = array();
$cnt =0;
while( $data = $stmt->fetch(PDO::FETCH_ASSOC)){
    
    $follow_tweets[$cnt] = array('id'=>$data['id'], 'tw_date' => $data['tw_date'], 'tw_user_id' => $data['tw_user_id'],
                             'tw_text'=>$data['tw_text'], 'retw_id'=>$data['retw_id'],'tw_img'=>$data['tw_img'],
                             'like_count'=>$data['like_count']);
    
    $cnt++;
}


