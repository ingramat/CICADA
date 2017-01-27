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
    for ($i = 0; $i < $len; $i++){
        $prePara = $prePara . "%:word$i% AND";
    }
    //  最後の 'AND'を削除
    $prePara = substr($prePara,0,-3);

    // ユーザ名、ユーザIDからの検索
    $pdo = db_connect();

    $sql = "SELECT * FROM `Profile` WHERE `user_id` LIKE ".$prePara." '%test%' OR `user_name` LIKE ".$prePara
        ." LIMIT :index, :numLimit";
    
    // セッション変数に検索クエリを保存しておく
    $_SESSION['search_profile_prepare_sql'] = $sql;
    $_SESSION['search_queries'] = $_GET['search_queries'];

} else{
    // 新規検索ではない時はセッションから検索クエリを取り出す

    if (!isset($_SESSION['search_profile_prepare_sql']) || $_SESSION['search_profile_prepare_sql'] ===''){
        // 新規検索でなく、保存したセッションもないときはエラー
        echo 'NO_SEARCH_QUERY';
        exit();
    }

    $sql = $_SESSION['search_profile_prepare_sql'];
    $queryWords = json_decode($_SESSION['search_queries']);
}

$stmt = $pdo->prepare($sql);
for($i=0; $i < $len; $i++){
    $stmt->bindValue(":word$i",$queryWord[$i],PDO::PARAM_STR);
}

$stmt->bindValue(':index',$index,PDO::PARAM_INT);
$stmt->bindValue(':numLimit',$limit,PDO::PARAM_INT);

if ($stmt->execute() == false){
  $error = $stmt->errorInfo();
 exit('SQL Error:'.$error[2]);
} 

$hitProfiles = array();
$cnt = 0;

while( $data = $stmt->fetch(PDO::FETCH_ASSOC)){
    // var_dump($data);
    $hitProfiles[$cnt] = new Profile($data['id'],$data['user_id'],$data['user_name'],null,$data['mail_adrs'],$data['profile_img'],
                            $data['profile_text'], json_decode($data['follow_ids']), json_decode($data['follower_ids']),
                            $data['reg_date'], $data['all_like_count'],$twCnt['COUNT(*)'],count(json_decode($data['follow_ids'])),
                            count(json_decode($data['follower_ids'])));

    $cnt++;
}

$is_end = false;
if ($cnt < 20) $is_end = true;
$index += $cnt;

$profileData = new ProfileData($hitProfiles,$index,$is_end);

echo json_encode($profileData,JSON_UNESCAPED_UNICODE);
exit();


?>