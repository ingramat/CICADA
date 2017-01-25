<?php

session_start();
include('./common_funcs.php');
include('./DataClass.php');

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
$sql = 'SELECT `user_pwd` FROM `Profile` WHERE ';
$stmt = '';

if ($email != ''){
     //  もしemailできてたら
    $sql = $sql.'`mail_adrs` = :email';
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':email',$email,PDO::PARAM_STR);
}   
else{
    // ユーザIDできてたら
    $sql = $sql.'`user_id` = :userId';
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

        // $profile = new ProfileData($data['id'],$data['user_id'],$data['user_name'],$data['mail_adrs'],$data['profile_img'],
        //                            $data['profile_text'], json_decode($data['follwo_ids']), json_decode($data['follwoer_ids']),
        //                            $data['reg_date'], $data['all_like_count']);

        // $_SESSION['profile_data'] = serialize($profile); 

        echo 'LOGIN_OK';
        exit();
    
    }else{
        // 検証できないならエラー
        echo 'VERIFY_NG';
        exit();
    }

}