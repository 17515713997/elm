<?php
	session_start();
	$_salt = "left";
	header("Content-type:textml;charset = utf8");
	@$_userName = $_REQUEST["userName"];
	//支付密码
	@$_in = $_REQUEST['in'];
	$_conn = mysqli_connect("localhost","root","","eellmmwangjinshuai");
	if(!$_conn){
		die("服务器连接错误");
	}
	$_sql = "set NAMES utf8";
    mysqli_query($_conn,$_sql);
	$_sql = "SELECT * FROM  user_register WHERE userName = '$_userName'";
    $_result = mysqli_query($_conn,$_sql);
    $_rows = mysqli_fetch_assoc($_result);
    if($_rows >= 1){
		$_sql = "UPDATE user_register SET verify = '$_in' WHERE userName = '$_userName'";
		$_result = mysqli_query($_conn,$_sql);
		if($_result){
			$_output['ok'] = "ok";
		}
    }
	echo json_encode($_output);
?>