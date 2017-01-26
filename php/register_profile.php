<?php

session_start();
include('./common_funcs.php');
include('./DataClass.php');
SessionCheck();

//とりあえず、セッション変数に情報があるか確認

if (!isset($_SESSION['user_id_tmp']) || !isset($_SESSION['user_name_tmp']) ||
    !isset($_SESSION['mail_adrs_tmp']) || !isset($_SESSION['user_pwd_tmp']) ){
        // データがセットされていなかったらエラー
        echo 'NO_REGISTER_INFO';
        exit();
}

if (isset($_SESSION['profile_img_tmp'])){
        // プロファイル画像がセットされていたら
        // プロファイル画像を一時保存フォルダから本番フォルダへ移動

        // 相対パスの先頭に.を追加して相対パスをPHPからのパスにする。
        $tmp_img = '.'.$_SESSION['profile_img_tmp'];
        $file_name = $_SESSION['profile_img_name_tmp'];
        $move_dir = '../profile_imgs/'.$file_name;

        if(!rename($tmp_img,$move_dir)){
                // ファイル移動に失敗したらエラー
                echo 'FILE_MOVE_ERROR';
                exit();
        }

        $profile_img = substr($move_dir,1);
} else {
        // プロファイル画像がセットされてない時は、デフォルト画像をセット
        $profile_img = './profile_imgs/default.png';

}

$pdo = db_connect();

$sql = 'INSERT INTO `Profile` (`id` , `user_id`, `user_name` , `user_pwd` , `mail_adrs`, `profile_img` , `profile_text` , `follow_ids` , `follower_ids` , `reg_date` , `all_like_count` )
        VALUES (null,:usrId,:usrName,:usrPwd,:mailAdrs,:profImg,:profText,"[]","[]",sysdate(),0)';

$stmt = $pdo->prepare($sql);
$stmt->bindValue(':usrId',$_SESSION['user_id_tmp'],PDO::PARAM_STR);
$stmt->bindValue(':usrName',$_SESSION['user_name_tmp'],PDO::PARAM_STR);
$stmt->bindValue(':usrPwd',password_hash($_SESSION['user_pwd_tmp'],PASSWORD_DEFAULT),PDO::PARAM_STR);
$stmt->bindValue(':mailAdrs',$_SESSION['mail_adrs_tmp'],PDO::PARAM_STR);
$stmt->bindValue(':profImg',$profile_img,PDO::PARAM_STR);
$stmt->bindValue(':profText',$_SESSION['profile_text_tmp'],PDO::PARAM_STR);

$res = $stmt->execute();

if ($res == false){
  $error = $stmt->errorInfo();
 exit('SQL Error:'.$error[2]);
} 

// SQL に格納できたら、一時セッションデータと、一時フォルダの画像を消す。

unlink($_SESSION['profile_img_tmp']);

unset($_SESSION['user_id_tmp']);
unset($_SESSION['user_name_tmp']);
unset($_SESSION['user_pwd_tmp']);
unset($_SESSION['mail_adrs_tmp']);
unset($_SESSION['profile_img_name_tmp']);
unset($_SESSION['profile_img_tmp']);
unset($_SESSION['profile_text_tmp']);



echo 'REGISTER_OK';
exit();