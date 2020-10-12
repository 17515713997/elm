<?php
    session_start();
    @$_userName = $_SESSION['userName'];
    @$_aid = $_GET['aid'];
    $_conn = mysqli_connect("localhost", "root","","eellmmwangjinshuai");	
	if(!$_conn){
		die("服务器连接错误");
	}	
	$_sql = "SET NAMES UTF8";
    mysqli_query($_conn,$_sql);
    $_sql = "UPDATE alladdress SET defaultAddr = 0 WHERE userName = '$_userName'";
    mysqli_query($_conn,$_sql);
    $_sql = "SELECT * FROM alladdress WHERE userName = '$_userName'";
    $_result = mysqli_query($_conn,$_sql);
    if(mysqli_fetch_assoc($_result) >= 1){
        $_sql = "UPDATE alladdress SET defaultAddr = 1 WHERE aid = '$_aid'";
        $_result = mysqli_query($_conn,$_sql);
        if(!$_result){
            $_output["result"] = "fail";
            $_output["msg"] = "牛逼";
            return;
        }
    }

?>