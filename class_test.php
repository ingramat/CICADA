<?php

include('./DataClass.php');

if (!isset($_POST['profile']) || $_POST['profile']==""){
    echo "POST_DATA_ERROR";
    exit();
}

$profile = json_decode($_POST['profile']);

echo json_encode($profile);
exit();