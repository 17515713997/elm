<?php
    @$_shopid = $_GET["shopid"];
    $_output = array();
    //连接数据库
    $_conn = mysqli_connect("localhost","root","","eellmmwangjinshuai");
    $_sql = "SET NAMES UTF8";
    mysqli_query($_conn,$_sql);
    $_sql = "SELECT sortid,sortName FROM  shopsortmsg WHERE shopid = '$_shopid' ";
    $_result = mysqli_query($_conn,$_sql);
    while(($_rows = mysqli_fetch_assoc($_result)) != NULL){
        $_output[] = $_rows;
    }
    echo json_encode($_output);
?>