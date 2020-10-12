<?php
    //getShopId.php
    
    //  和dish_getBySid.php    相同的php文件
    //  通过shioid取值
    @$_shopid = $_GET["shopid"];
    $_output = array();
    //连接数据库
    $_conn = mysqli_connect("localhost","root","","eellmmwangjinshuai");
    //如果连接数据库出错
    if(!$_conn){
        die("服务器连接错误");//返回错误信息
        return;//停止继续向下执行
    }
    $_sql = "SET NAMES UTF8";
    mysqli_query($_conn,$_sql);
    $_sql = "SELECT * FROM store WHERE shopid  = '$_shopid' ";
    $_result = mysqli_query($_conn,$_sql);
    while(($_rows = mysqli_fetch_assoc($_result)) != NULL){
        $_output[] = $_rows;
    }
    echo json_encode($_output);
?>