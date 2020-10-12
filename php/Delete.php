<?php
    header("Content-Type:text/html;charset=utf-8");
    @$_aid = $_GET["aid"];//自增
    $_conn = mysqli_connect("localhost","root","","eellmmwangjinshuai");
    $_sql = "SET NAMES UTF8";
    mysqli_query($_conn,$_sql);
    $_sql = "DELETE FROM alladdress WHERE aid = '$_aid'";
    if(mysqli_query($_conn,$_sql)){
        echo "删除 ".mysql_affected_rows()." 条数据记录。";
    } else {
        exit("删除数据失败：".mysql_error());
    }
    // echo ("完成");
?>