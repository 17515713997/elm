<?php
	//当前页面用于验证用户注册数据信息
	@$_userName = $_REQUEST["userName"];
	@$_phone = $_REQUEST["phone"];
	//@$_pid = $_REQUEST["pid"];
	//@$_email = $_REQUEST["email"];
	$_conn = mysqli_connect("localhost", "root","","eellmmwangjinshuai");
	$_sql = "SET NAMES UTF8";
	mysqli_query($_conn,$_sql);
	$_temp = "";
	if($_userName){
		$_sql = "select userName FROM user_register WHERE userName = $_userName";
		$_temp = "用户名";
	}
	if($_phone){
		$_sql = "select userName FROM user_register WHERE userName = $_phone";
		$_temp = "手机号";
	}
	// if($_userName){
	// 	$_sql = "select userName FROM user_register WHERE userName = $_userName";
	// 	$_temp = "身份证";
	// }
	// if($_userName){
	// 	$_sql = "select userName FROM user_register WHERE userName = $_userName";
	// 	$_temp = "邮箱";
	// }
	//开始查询语句
	$_result = mysqli_query($_conn,$_sql);
	$_row = mysqli_fetch_assoc($_result);
	if($_row >= 1){
		$_output["reg_insert"] = "fail";
		$_output["mmm"] = "该".$_temp."以注册";
	}else{
		$_output["reg_insert"] = "ok";
		$_output["mmm"] = "该".$_temp."未注册";
	}
	echo json_encode($_output);

?>