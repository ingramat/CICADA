<?php

session_start();
include('./common_funcs.php');
include('./DataClass.php');

if (!isset($_POST['user_id']) || $_POST['user_id'] == ''||
!isset($_POST['user_name']) || $_POST['user_name'] == ''||
!isset($_POST['mail_adrs']) || $_POST['mail_adrs'] == ''||
!isset($_POST['user_pwd']) || $_POST['user_pwd'] == '' ){
    //POST データがきちんと来ていない場合はエラー
    echo 'POST_DATA_ERROR';
    exit();
}

//とりあえず、セッションに格納
$_SESSION['chk_ssid'] = session_id();

// 入力値をサニタライズ
$_SESSION['user_id_tmp'] = h($_POST['user_id']);
$_SESSION['user_name_tmp'] = h($_POST['user_name']);
$_SESSION['mail_adrs_tmp'] = h($_POST['mail_adrs']);
$_SESSION['user_pwd_tmp'] = h($_POST['user_pwd']);
$_SESSION['profile_text_tmp'] = h($_POST['profile_text']);


// ユーザーIDとメールアドレスに重複があるかチェック
$pdo = db_connect();

$sql = "SELECT COUNT(*) FROM `Profile`  WHERE `user_id` = :usrId OR `mail_adrs` = :mailAdrs";
$stmt = $pdo->prepare($sql);
$stmt->bindValue(":usrId",$_SESSION['user_id_tmp'],PDO::PARAM_STR);
$stmt->bindValue(":mailAdrs",$_SESSION['mail_adrs_tmp'],PDO::PARAM_STR);
$res = $stmt->execute();

if ($res == false){
  $error = $stmt->errorInfo();
 exit('SQL Error:'.$error[2]);
} 

$data = $stmt->fetch(PDO::FETCH_ASSOC);

if ( $data['COUNT(*)'] > 0){
    // もしすでにレコードがあるなら
    echo 'ALREADY_EXISTS';
    exit();
}



//1.アップロードが正常に行われたかチェック
//isset();でファイルが送られてきてるかチェック！そしてErrorが発生してないかチェック
if(isset($_FILES['profile_img']) && $_FILES['profile_img']['error']==0){
    
    if (isset($_SESSION['upload_file_name'])){
        //すでにアップロードしたファイルがある場合は、同じファイルかチェックする。
        if ( $_SESSION['upload_file_name'] == $_FILES["profile_img"]["name"] ){
            echo 'RECEIVE_OK';
            exit();
        }
    }

    // 画像ファイルかチェック
    $filepath = pathinfo($_FILES['tw_img']['name']);
    $filetype = $filepath['extension'];

    $filetype = strtolower($filetype);

    if (!in_array($filetype,array('jpg','jpeg','gif','png','bmp'),true)){
        // もしファイル形式が画像以外なら
        echo 'FILE_INVALID';
        exit();
    }


    //***File名の変更***
    $file_name = $_FILES["profile_img"]["name"]; //ファイル名取得
    $extension = pathinfo($file_name, PATHINFO_EXTENSION); //拡張子取得
    $uniq_name = date("YmdHis").md5(session_id()) . "." . $extension;  //ユニークファイル名作成

    //2. アップロード先とファイル名を作成
    $upload_file = "../tmp_profile_imgs/".$uniq_name; //ユニークファイル名とパス
    
    // アップロードしたファイルを指定のパスへ移動
    //例）move_uploaded_file("一時保存場所","成功後に正しい場所に移動");
    if (move_uploaded_file($_FILES["profile_img"]['tmp_name'],$upload_file)){
        
        //パーミッションを変更（ファイルの読み込み権限を付けてあげる）
        chmod($upload_file,0644);

        // パス名の最初の.を削除する。
        $_SESSION['profile_img_tmp'] = substr($upload_file,1);

        //セッションにファイル名情報を格納
        $_SESSION['profile_img_name_tmp'] = $uniq_name;
        $_SESSION['upload_file_name'] = $_FILES["profile_img"]["name"];

        // FILES

        echo 'RECEIVE_OK';
        exit();
        
    }else{
        echo "FILE_MOVE_ERROR";
        exit();
    }
} else if(!isset($_FILES['profile_img'])) {
    //ファイルがアップロードされてなければ正常終了。
    echo "RECEIVE_OK";
    exit(); 

}else {
    echo 'FILE_UPLOAD_ERROR';
    exit();
}




