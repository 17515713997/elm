<?php
    session_start();
    $salt = "left";
    header("Content-type:textml;charset = utf8");
    @$_userName = $_REQUEST["userName"];
    $_output = array();
    $_conn = mysqli_connect("localhost","root","","eellmmwangjinshuai");
    if(!$_conn){
        die("服务器连接错误");
    }
    $_sql = "set NAMES utf8";
    mysqli_query($_conn,$_sql);
    $_sql = "SELECT * FROM user_register WHERE userName = '$_userName'";
    $_result = mysqli_query($_conn,$_sql);
    $_rows = mysqli_fetch_assoc($_result);
    if($_rows >= 1){
        $_SESSION["userName"] = $_userName;
        $_output["m"] = $_rows;
        $_output["a"] = "ok";
    }else{
        $_output["b"] = "nook";
    }
    echo json_encode($_output);
?>