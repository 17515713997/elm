<?php
	session_start();
	$_salt = "left";
    header("Content-type:text/html;charset = utf8");
	//该文件用于注册验证使用
    @$_userName = $_REQUEST["userName"];
	@$_pwd = mysql_real_escape_string(md5($_salt.$_REQUEST["userpwd"]));
	@$_phone = $_REQUEST["userPhone"];
	@$_id = $_REQUEST["userId"];
	@$_mail =  $_REQUEST["usermail"];
	$_conn = mysqli_connect("localhost", "root","","eellmmwangjinshuai");	
	if(!$_conn){
		die("服务器连接错误");
	}	
	$_arr = array();
	$_sql = "SET NAMES UTF8";
	mysqli_query($_conn,$_sql);

	$_sql = "INSERT INTO user_register (uid,userName,pwd,phone,id,mail) VALUES (null,'$_userName','$_pwd','$_phone','$_id','$_mail')";
	$_result = mysqli_query($_conn,$_sql);

	if($_result){//主要取到数据的条数大于等于1  就代表数据库中存在，则不能是使用
		$_arr["userName_result"] = "ok";
		$_arr["mmm"] = "ok!";
		// $_SESSION["userPhone"] = $_phone;
	}else{
		$_arr["userName_result"] = "fail";
		$_arr["mmm"] = mysqli_error($_conn);
	}
	echo json_encode($_arr);
?>