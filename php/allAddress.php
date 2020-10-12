<?php
    header("Content-Type:text/html;charset=utf-8");
    session_start();
    @$_userName = $_SESSION[ "userName"] ;
    $_conn = mysqli_connect("localhost","root","","eellmmwangjinshuai");
    if(!$_userName || $_userName == ""){
        echo "请先登录";
        return;
    }
    $_output = array();
    $_sql = "SET NAMES UTF8";
    mysqli_query($_conn,$_sql);

    $_sql = "SELECT * FROM alladdress WHERE userName = '$_userName' ";

    $_result = mysqli_query($_conn,$_sql);

    while(($_rows = mysqli_fetch_assoc($_result)) != NULL){
        $_output[] = $_rows;
    }
    echo json_encode($_output);
?>