<?php
    session_start();
    $_salt = "left";
    header("Content-type:text/html;charset = utf8");
    // @$_userName = mysql_real_escape_string($_REQUEST["userName"]);
    // @$_userName1 = mysql_real_escape_string(md5($_REQUEST["userName"]));
    // @$_userName2 = mysql_real_escape_string(md5($_salt.$_REQUEST["userName"]));
   
    //在服务器查找数据库
    //mysql_select_db("",$_conn);
    @$_userName = $_REQUEST["userName"];
    @$_pwd = mysql_real_escape_string(md5($_salt.$_REQUEST["pwd"]));
    @$_regCode = $_REQUEST["regCode"];
    $_conn = mysqli_connect("localhost", "root","","eellmmwangjinshuai");	
    $_sql = "SET NAMES UTF8";
    mysqli_query($_conn,$_sql);
    // if(!$_conn){
	// 	die("服务器连接错误");
	// }
    $_sql = "SELECT userName FROM user_register WHERE userName = '$_userName' ";
    $_result = mysqli_query($_conn,$_sql);
    $_rows = mysqli_fetch_assoc($_result);
    if($_rows >= 1){
        if($_regCode == $_SESSION["vaildCode"]){
            $_sql = "SELECT userName FROM user_register WHERE userName='$_userName' AND pwd = '$_pwd'";
            $_result = mysqli_query($_conn,$_sql);
            //取出数据的数量
            $_rows = mysqli_num_rows($_result);
            if($_rows >= 1){
                $_SESSION["userName"] = $_userName;
                $_output["reg_insert"] = "ok";
                $_output["msg"] = "登录成功";
            }else{
                $_output["reg_insert"] = "fail";
                $_output["pwd"] = "密码有误，请重新输入";
            }
        }else{
            $_output["reg_insert"] = "fail";
            $_output["regCode"] = "验证码不匹配";
        }
    }else{
        $_output["reg_insert"] = "fail";
        $_output["userName"] = "该用户不存在，请注册";
    }
    
    echo json_encode($_output);
?>