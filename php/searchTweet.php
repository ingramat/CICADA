<?php

session_start();
include('./common_funcs.php');
include('./DataClass.php');
SessionCheck();

if (!isset($_GET['index']) || $_GET['index'] == '' ){
    // インデックスが来てないならエラー
    echo 'GET_NO_INDEX';
    exit();
}

// インデックスを格納
$index = intval($_GET['index']);
// 一度に返す検索結果数
$limit = 20;

if (isset($_GET['search_queries']) && $_GET['search_queries'] !== ''){
    // 検索ワードが来ていれば、新規検索する。

    // 検索ワードをGETクエリから取得
    $queryWords = json_decode($_GET['search_queries']);

    $qlen = count($queryWords);
        
    // sqlクエリ用の変数代入先文字列を生成
    $prePara = '';
    for ($i = 0; $i < $qlen; $i++){
        $prePara = $prePara . ":word$i AND";
    }

    //  最後の 'AND'を削除
    $prePara = substr($prePara,0,-3);

    // ツイート本文の検索
    $pdo = db_connect();

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
        WHERE `tw_text` LIKE ".$prePara."
        ORDER BY `latest_date` DESC
        LIMIT :index, :numLimit";
    

    // セッション変数に検索クエリを保存しておく
    $_SESSION['search_tweet_prepare_sql'] = $sql;
    $_SESSION['search_queries'] = $_GET['search_queries'];

} else{
    // 新規検索ではない時はセッションから検索クエリを取り出す

    if (!isset($_SESSION['search_tweet_prepare_sql']) || $_SESSION['search_tweet_prepare_sql'] ===''){
        // 新規検索でなく、保存したセッションもないときはエラー
        echo 'NO_SEARCH_QUERY';
        exit();
    }

    $sql = $_SESSION['search_tweet_prepare_sql'];
    $queryWords = json_decode($_SESSION['search_queries']);
}

$stmt = $pdo->prepare($sql);
for($i=0; $i < $qlen; $i++){
    $stmt->bindValue(":word$i",'%'.$queryWords[$i].'%',PDO::PARAM_STR);
}


$stmt->bindValue(':index',$index,PDO::PARAM_INT);
$stmt->bindValue(':numLimit',$limit,PDO::PARAM_INT);

if ($stmt->execute() == false){
  $error = $stmt->errorInfo();
 exit('SQL Error:'.$error[2]);
} 

$hitTweets = array();
$cnt = 0;

while( $data = $stmt->fetch(PDO::FETCH_ASSOC)){
    // var_dump($data);
    $hitTweets[$cnt] = new Tweet($data['id'],$data['tw_date'],$data['tw_user_id'],$data['tw_text'],
                        $data['retw_id'],$data['retw_user_id'],$data['retw_date'],$data['retw_count'],$data['tw_img'],
                        $data['like_count'],$data['tw_user_name'],$data['tw_user_usrId'],$data['tw_profile_img'],
                        $data['retw_user_name'],$data['retw_user_usrId'],$data['retw_profile_img']);
    $cnt++;
}

$is_end = false;
if ($cnt < 20) $is_end = true;
$index += $cnt;

$tweetData = new TweetData($hitTweets,$index,$is_end);

echo json_encode($tweetData,JSON_UNESCAPED_UNICODE);
exit();
?>