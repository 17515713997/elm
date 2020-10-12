<?php
    session_start();
    @$_uid = $_SESSION["userName"];
    @$_orderid= $_GET['orderid'];
    @$_shopName = $_GET["shopName"];
    @$_num = $_GET["num"];
    @$_price = $_GET["money"];
    @$_orderDetails = $_GET["order"];
    @$_orderState = $_GET["orderState"];
    //链接数据库
    $_conn = mysqli_connect("localhost", "root","","eellmmwangjinshuai");	
	if(!$_conn){
		die("服务器连接错误");
    }
    //让数据编译成utf-8
    $_sql = "SET NAMES UTF8";
    //执行查询$_conn数据库里的$_sql表
    mysqli_query($_conn,$_sql);
    //把输出的数据放入数组中
    $_output = array();
    //定义查询表
    $_sql = "SELECT * FROM shopcarorder WHERE uid = '$_uid'"; 
    //执行查询
    $_result = mysqli_query($_conn,$_sql);
    //如果有值，就执行
	while(($_rows = mysqli_fetch_assoc($_result)) != NULL){
        $_output[] = $_rows;
    }
    echo json_encode($_output);
?>
