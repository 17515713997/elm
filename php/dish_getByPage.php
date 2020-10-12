<?php
    //  dish_getByPage.php    
    //  该php文件用于main.html页面
    //  该文件向客户端返回菜品数据，以json形式
    //  每次最多返回两条数据
    //  需要客户端提供从哪一行开始读取数据，取多少条
    //  如果客户端未提供起始行，则默认从第0行开始读取数据


    @$_start = $_GET["start"];
    if(!$_start){
        $_start = 0;
    }
    @$_listCount = $_GET["listCount"];
    if(!$_listCount){
        $_listCount = 2;
    }
    $_output = array();
    // echo "$_start : $_listCount";

    //连接数据库
    $_conn = mysqli_connect("localhost","root","","eellmmwangjinshuai");
    //如果连接数据库出错
    if(!$_conn){
        die("服务器连接错误");//返回错误信息
        return;//停止继续向下执行
    }

    $_sql = "SET NAMES UTF8";
    mysqli_query($_conn,$_sql);

    $_sql = "SELECT sid,name,price,img_sm,material FROM elem_dish LIMIT $_start,$_listCount";

    $_result = mysqli_query($_conn,$_sql);
    while(($_rows = mysqli_fetch_assoc($_result)) != NULL){
        $_output[] = $_rows;
    }
    
    echo json_encode($_output);



?>