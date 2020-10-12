<?php
    session_start();
    @$_userName = $_SESSION["userName"];

    @$_name = $_GET["name"];//联系人
    @$_sex = $_GET["sex"];//性别
    @$_tel = $_GET["tel"];//电话
    @$_address = $_GET["addr"];//地址
    @$_Doorplate = $_GET["doorplate"];//门牌号
    @$_label = $_GET["label"];//标签

    @$_dName = $_GET["dName"];
    @$_dsex = $_GET["dsex"];
    @$_dtel = $_GET["dtel"];
    @$_daddr = $_GET["daddr"];
    @$_dDoorplate = $_GET["ddoorplate"];
    @$_dlabel = $_GET["dlabel"];

    $_output = array();
    $_conn = mysqli_connect("localhost", "root","","eellmmwangjinshuai");	
    if(!$_conn){
        die("服务器连接错误");
    }	
    $_sql = "SET NAMES UTF8";
    mysqli_query($_conn,$_sql);

    // $_sql = "SELECT * FROM alladdress WHERE userName = '$_userName'";
    // $_result = mysqli_query($_conn,$_sql);
    // if(mysqli_fetch_assoc($_result) >= 1){
    //     $_sql = "UPDATE alladdress SET defaultAddr = 0 WHERE userName = '$_userName'";
    //     $_result = mysqli_query($_conn,$_sql);
    //     if(!$_result){
    //         $_output["result"] = "fail";
    //         $_output["msg"] = "朱哥牛逼";
    //         return;
    //     }
    // }

    $_sql = "SELECT * FROM alladdress WHERE userName = '$_userName'";
    $_result = mysqli_query($_conn,$_sql);
    if(mysqli_fetch_assoc($_result) >= 1){
        $_sql = "UPDATE alladdress SET name = '$_name',sex = '$_sex',tel = '$_tel',Doorplate = '$_Doorplate',label = '$_label'  WHERE name = '$_dName' AND sex = '$_dsex' AND tel = '$_dtel'   AND Doorplate = '$_dDoorplate' AND label = '$_dlabel'";
        $_result = mysqli_query($_conn,$_sql);
        if(!$_result){
            $_output["result"] = "fail";
            $_output["msg"] = "憨逼";
            return;
        }else{
            $_output["result"] = "ok";
            $_output["msg"] = "修改成功";
        }
    }
    
    echo json_encode($_output);
?>