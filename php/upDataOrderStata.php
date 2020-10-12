<?php
    session_start();
    $_userName = $_SESSION["userName"];
    $_orderid = $_POST["orderid"];
    $_orderState = $_POST["orderState"];
    $_conn = mysqli_connect("localhost", "root","","eellmmwangjinshuai");	
    $_sql = "SET NAMES UTF8";
    mysqli_query($_conn,$_sql);
    $_output = array();
    if($_orderState === 4){
        $_old = 0;
    }else{
        $_old = $_orderState - 1 ;
    }
    $_sql = "UPDATE shopcarorder SET orderState = '$_orderState' WHERE uid = '$_userName' AND orderid = '$_orderid' ";
    $_result = mysqli_query($_conn,$_sql);
    if($_result){
        $_output["msg"] = "ok";
        $_output["aaa"] = $_old;
    }else{
        $_output["msg"] = "nook";
        $_output["aaa"] = $_old;
    }
    echo json_encode($_output);
?>