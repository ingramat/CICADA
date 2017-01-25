<?php

session_start();
include('./common_funcs.php');

if (!isset($_POST['user_id_OR_email']) || $_POST['user_id_OR_email'] == ''||
!isset($_POST['user_pwd']) || $_POST['user_pwd'] == '' ){
    //POST データがきちんと来ていない場合はエラー
    echo 'POST_DATA_ERROR';
    exit();
}

$email = '';
$userId = '';

// email アドレスかどうかチェック
if ( strstr($_POST['user_id_OR_email'],'@'))    $email = $_POST['user_id_OR_email'];
else    $userId = $_POST['user_id_OR_email'];


$pdo = db_connect();

$pwd = $_POST['user_pwd'];
$sql = 'SELECT * FROM `profile` WHERE ';
$stmt = '';

if ($email != ''){
     //  もしemailできてたら
    $sql += '`mail_adrs` = :email';
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':email',$email,PDO::PARAM_STR);
}   
else{
    // ユーザIDできてたら
    $sql += '`user_id` = :userId';
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':userId',$userId,PDO::PARAM_STR);
}  

$res = $stmt->execute();

if ($res == false){
  $error = $stmt->errorInfo();
 exit('SQL Error:'.$error[2]);
} 

$data = $stmt->fetch(PDO::FETCH_ASSOC);
if (!isset($data['user_pwd']) || $data['user_pwd'] == ''){
    // もしパスワードが出てこなかったらエラーを返す。
    echo 'NO_USER_FOUND';
    exit();

} else {
    // パスワードが見つかったら、ハッシュ値を検証する。
    if (password_verify($pwd,$data['user_pwd'])){
        // もし検証がOKならセッション変数にデータ格納

        $_SESSION['chk_ssid'] = session_id();

        $_SESSION['user_id'] = $data['user_id'];
        $_SESSION['user_name'] = $data['user_name'];
        $_SESSION['mail_adrs'] = $data['mail_adrs'];
        $_SESSION['profile_img'] = $data['profile_img'];
        $_SESSION['profile_text'] = $data['profile_text'];
        $_SESSION['follow_ids'] = json_decode($data['follwo_ids']);
        $_SESSION['follower_ids'] = json_decode($data['follwoer_ids']);
        $_SESSION['reg_date'] = $data['reg_date'];
        $_SESSION['all_like_count'] = $data['all_like_count'];



        echo 'LOGIN_OK';
        exit();
    
    }else{
        // 検証できないならエラー
        echo 'VERIFY_NG';
        exit();
    }

}