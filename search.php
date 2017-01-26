<?php

session_start();
include('./common_funcs.php');

// SessionCheck();

// 検索ワードをGETクエリから取得
$queryWord = h($_GET['search_word']);

// ユーザ名、ユーザIDからの検索
$pdo = db_connect();

$sql = "SELECT * FROM `profile` WHERE `user_id` LIKE '%:word%' OR `user_name` LIKE '%:word%";
$stmt = $pdo->prepare($sql);
$stmt->bindValue(':word',$queryWord,PDO::PARAM_STR);
$res = $stmt->exec();

if ($res == false){
  $error = $stmt->errorInfo();
 exit('SQL Error:'.$error[2]);
} 

$hitProfiles = array();
$cnt = 0;

while( $data = $stmt->fetch(PDO::FETCH_ASSOC)){
    // var_dump($data);
    $hitProfiles[$cnt] = array('id'=>$data['id'], 'user_id' => $data['user_id'], 'user_name' => $data['user_name'],
                             'profile_img'=>$data['profile_img'], 'profile_text'=>$data['profile_text']);
    $cnt++;
}
// セッションに検索結果を格納
$_SESSION['hitProfiles'] = $hitProfiles;


// ツイート本文の検索
$pdo = db_connect();

$sql = "SELECT * FROM `tweet` WHERE `tweet_text` LIKE '%:word%'";
$stmt = $pdo->prepare($sql);
$stmt->bindValue(':word',$queryWord,PDO::PARAM_STR);
$res = $stmt->exec();

if ($res == false){
  $error = $stmt->errorInfo();
 exit('SQL Error:'.$error[2]);
} 

$hitTweets = array();
$cnt = 0;

while( $data = $stmt->fetch(PDO::FETCH_ASSOC)){
    // var_dump($data);
    $hitTweets[$cnt] = array('id'=>$data['id'], 'tw_date' => $data['tw_date'], 'tweet_user_id' => $data['tweet_user_id'],
                             'tweet_text'=>$data['tweet_text'], 'like_count'=>$data['like_count']);
    $cnt++;
}

// セッションに検索結果を格納
$_SESSION['hitTweets'] = $hitTweets;

//ajax に OKを返信
echo 'OK';
?>