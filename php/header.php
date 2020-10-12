<?php
    header("Content-Type:text/html;charset=utf-8");
    session_start();
    @$_userName = $_SESSION["userName"];
    if(!$_userName){
        $_userName = null;
    }
    echo $_userName;
?>