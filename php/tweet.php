<?php
session_start();
include('./common_funcs.php');
include('./DataClass.php');
SessionCheck(); 

if (!isset($_POST['tw_text']) || $_POST['tw_text'] == '' ){
    //  ツイート本文がなかったらエラー
    echo 'POST_DATA_ERROR';
    exit();
}

// 入力値をサニタライズ
$tw_text = h($_POST['tw_text']);


//1.アップロードが正常に行われたかチェック
//isset();でファイルが送られてきてるかチェック！そしてErrorが発生してないかチェック
if(isset($_FILES['tw_img']) && $_FILES['tw_img']['error']==0){


    //***File名の変更***
    $file_name = $_FILES["tw_img"]["name"]; //ファイル名取得
    $extension = pathinfo($file_name, PATHINFO_EXTENSION); //拡張子取得
    $uniq_name = date("YmdHis").md5(session_id()) . "." . $extension;  //ユニークファイル名作成

    //2. アップロード先とファイル名を作成
    $upload_file = "../tw_imgs/".$uniq_name; //ユニークファイル名とパス
    
    // アップロードしたファイルを指定のパスへ移動
    //例）move_uploaded_file("一時保存場所","成功後に正しい場所に移動");
    if (move_uploaded_file($_FILES["tw_img"]['tmp_name'],$upload_file)){
        
        //パーミッションを変更（ファイルの読み込み権限を付けてあげる）
        chmod($upload_file,0644);

        // htmlからのパスに変更するため、先頭の.を削除する。
        $upload_file =  substr($upload_file,1);
        
    }else{
        echo "FILE_MOVE_ERROR";
        exit();
    }

    // sqlの作成
    $sql = "INSERT INTO `tweet`(`id`, `tw_date`, `tw_user_id`, `tw_text`, `retw_id`, `retw_user_id`, `retw_date`, `retw_count`, `tw_img`, `like_count`)
             VALUES (NULL,sysdate(),:uId,:twText,NULL,0,'1000-01-01 00:00:00',0,:twImg,0)";

} else {
    //ファイルがアップロードされてなければ

    // sqlの作成
    $sql = "INSERT INTO `tweet`(`id`, `tw_date`, `tw_user_id`, `tw_text`, `retw_id`, `retw_user_id`, `retw_date`, `retw_count`, `tw_img`, `like_count`)
             VALUES (NULL,sysdate(),:uId,:twText,NULL,0,'1000-01-01 00:00:00',0,NULL,0)";

}

// SQLサーバへ接続
$pdo = db_connect();

$stmt = $pdo->prepare($sql);
$stmt->bindValue(':uId',$_SESSION['login_id'],PDO::PARAM_INT);
$stmt->bindValue(':twText',$tw_text,PDO::PARAM_STR);
// 画像があるならバインド

if (isset($upload_file) && $upload_file != '') $stmt->bindValue(':twImg',$upload_file,PDO::PARAM_STR); 

if ($stmt->execute() == false){
  $error = $stmt->errorInfo();
 exit('SQL Error:'.$error[2]);
} 

echo 'REGISTER_OK';
exit();