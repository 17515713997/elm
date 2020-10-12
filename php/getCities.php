<?php
    header("Content-Type:text/html;charset=utf-8");
    $_conn = mysqli_connect("localhost","root","","eellmmwangjinshuai");
    $_output = array();
    //接收外部传递的省份信息
    $_provinces = $_REQUEST["index"];
    //通过省份的名称 获取省份的编号，在通过省份的编号 取城市
    $_sql = "SET NAMES UTF8";
    mysqli_query($_conn,$_sql);
    $_sql = "SELECT c.city,p.provinceid,c.cityid  FROM cities AS c LEFT JOIN  provinces AS p ON p.provinceid = c.provinceid WHERE p.province = '$_provinces' ";
    $_result = mysqli_query($_conn,$_sql);
    while(($_rows = mysqli_fetch_assoc($_result)) != NULL){
        $_output[] = $_rows;
    }
    echo json_encode($_output);
    mysqli_close($_conn);
?>