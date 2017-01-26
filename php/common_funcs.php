<?php

function h($val){
    return htmlspecialchars($val,ENT_QUOTES);
}


function SessionCheck(){
    if (!isset($_SESSION['chk_ssid']) || $_SESSION['chk_ssid'] != session_id() ){
        header('Location:./session_error.html');
        exit;
    } else {
        session_regenerate_id(true);
        $_SESSION['chk_ssid'] = session_id();
    }
}

function db_connect(){
    try {
        $pdo = new PDO('mysql:dbname=ingramat_twitter;charset=utf8mb4;host=localhost','cicada','cicada');
    } catch (PDOException $e){
        exit('DbConnectError:'.$e->getMessage());
    }

    return $pdo;
}


?>