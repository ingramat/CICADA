<?php

session_start();
// make session empty array
$_SESSION = array();

// delete session id which saved at browser cookie
if (isset($_COOKIE[session_name()])){
    setcookie(session_name(), '', time()-42000, '/');
}

// delete session which saved in the server
session_destroy();
echo 'LOGOUT_OK';
exit();