<?php
    session_start();
    @$_userName = $_SESSION["userName"];
    @$_aid = $_GET["aid"];//自增
    @$_name = $_GET["name"];//联系人
    @$_sex = $_GET["sex"];//性别
    @$_tel = $_GET["tel"];//电话
    @$_address = $_GET["addr"];//地址
    @$_Doorplate = $_GET["doorplate"];//门牌号
    @$_label = $_GET["label"];//标签
    @$_defaultAddr = $_GET["defaultAddr"];//默认地址
    $_conn = mysqli_connect("localhost", "root","","eellmmwangjinshuai");
	if(!$_conn){
		die("服务器连接错误");
	}	
	$_sql = "SET NAMES UTF8";
    mysqli_query($_conn,$_sql);
    //修改 不等于 0 的 
    $_sql = "SELECT * FROM alladdress WHERE userName = '$_userName'";
    $_result = mysqli_query($_conn,$_sql);
    if(mysqli_fetch_assoc($_result) >= 1){
        $_sql = "UPDATE alladdress SET defaultAddr = 0 WHERE userName = '$_userName'";
        $_result = mysqli_query($_conn,$_sql);
        if(!$_result){
            $_output["result"] = "fail";
            $_output["msg"] = "哈比";
            return;
        }
    }
    //插入
    $_sql = "INSERT INTO alladdress (aid,userName,name,sex,tel,address,Doorplate,label,defaultAddr) VALUES ('$_aid','$_userName','$_name','$_sex','$_tel','$_address','$_Doorplate','$_label',1)";
	$_result = mysqli_query($_conn,$_sql);

	if($_result){
        $_output["result"] = "ok";
		$_output["orderid"] = "成功";
	}else{
		$_output["result"] = "fail";
		$_output["msg"] = "添加失败";
	}
    echo json_encode($_output);
?>