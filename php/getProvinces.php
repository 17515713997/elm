<?php
    header("Content-Type:text/html;charset=utf-8");
    $_conn = mysqli_connect("localhost","root","","eellmmwangjinshuai");
    $_output = array();
    $_sql = "SET NAMES UTF8";
    mysqli_query($_conn,$_sql);
    $_sql = "SELECT * FROM provinces";
    $_result = mysqli_query($_conn,$_sql);
    while(($_rows = mysqli_fetch_assoc($_result)) != NULL){
        $_output[] = $_rows;
    }
    echo json_encode($_output);
    mysqli_close($_conn);
?>