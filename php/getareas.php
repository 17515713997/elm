<?php
    header("Content-Type:text/html;charset=utf-8");
    $_conn = mysqli_connect("localhost","root","","eellmmwangjinshuai");
    $_output = array();
    $_city = $_REQUEST["index"];
    $_sql = "SET NAMES UTF8";
    mysqli_query($_conn,$_sql);
    $_sql = "SELECT * FROM areas";
    $_sql = "SELECT a.areaid,a.area,c.cityid  FROM areas AS a LEFT JOIN  cities AS c ON c.cityid = a.cityid WHERE c.city = '$_city' ";
    $_result = mysqli_query($_conn,$_sql);
    while(($_rows = mysqli_fetch_assoc($_result)) != NULL){
        $_output[] = $_rows;
    }
    echo json_encode($_output);
    mysqli_close($_conn);
?>