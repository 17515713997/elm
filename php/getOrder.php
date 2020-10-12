<?php
    @$_orderid = $_GET["orderid"];
    $_output = array();
    $_conn = mysqli_connect("localhost","root","","eellmmwangjinshuai");
    if(!$_conn){
        die("服务器连接错误");
    }
    $_sql = "SET NAMES UTF8";
    mysqli_query($_conn,$_sql);
    $_sql = "SELECT * FROM shopcarorder WHERE orderid = '$_orderid'";
    $_result = mysqli_query($_conn,$_sql);
    while(($_rows = mysqli_fetch_assoc($_result)) != NULL){
        $_output[] = $_rows;
    }
    echo json_encode($_output);
?>