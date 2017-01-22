<?php

session_start();
include('./common_funcs.php');

if (!isset($_POST['user_id']) || $_POST['user_id'] == ''||
!isset($_POST['user_name']) || $_POST['user_name'] == ''||
!isset($_POST['mail_adrs']) || $_POST['mail_adrs'] == ''||
!isset($_POST['user_pwd']) || $_POST['user_pwd'] == '' ){
    //POST データがきちんと来ていない場合はエラー
    echo 'POST_DATA_ERROR';
    exit();
}

$_SESSION['chk_ssid'] = session_id();

$_SESSION['user_id_tmp'] = $_POST['user_id'];
$_SESSION['user_name_tmp'] = $_POST['user_name'];
$_SESSION['mail_adrs_tmp'] = $_POST['mail_adrs'];
$_SESSION['user_pwd_tmp'] = $_POST['user_pwd'];
$_SESSION['profile_text_tmp'] = $_POST['profile_text'];

//1.アップロードが正常に行われたかチェック
//isset();でファイルが送られてきてるかチェック！そしてErrorが発生してないかチェック
if(isset($_FILES['filename']) && $_FILES['filename']['error']==0){
    
    //***File名の変更***
    $file_name = $_FILES["filename"]["name"]; //"1.jpg"ファイル名取得
    $extension = pathinfo($file_name, PATHINFO_EXTENSION); //拡張子取得
    $uniq_name = date("YmdHis").md5(session_id()) . "." . $extension;  //ユニークファイル名作成

    //2. アップロード先とファイル名を作成
    $upload_file = "./profile_imgs/".$uniq_name; //ユニークファイル名とパス
    
    // アップロードしたファイルを指定のパスへ移動
    //例）move_uploaded_file("一時保存場所","成功後に正しい場所に移動");
    if (move_uploaded_file($_FILES["filename"]['tmp_name'],$upload_file)){
        
        //パーミッションを変更（ファイルの読み込み権限を付けてあげる）
        chmod($upload_file,0644);

        $_SESSION['profile_img_tmp'] = $upload_file;
        
    }else{
        echo "FILE_MOVE_ERROR";
        exit();
    }
}else{
    echo "FILE_UPLOAD_ERROR";
    exit();
}

echo 'RECEIVE_OK';
exit();