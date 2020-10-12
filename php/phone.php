<?php
    header("Content-Type:text/html;charset=utf-8");
    session_start();
    @$_phone = $_SESSION["userPhone"];
    // if(!$_userName){
    //     $_userName = null;
    // }
    echo $_phone;
?>