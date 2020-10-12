<?php
    //  通过店铺shopid获取商品数据   
    //  getShopDishById.php
    //  该页面用于店铺商品页面
    //  该页面是否按分页方式书写，正式开发时，应按客户需求
    @$_shopid = $_GET["shopid"];
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
    $_sql = "SELECT sid,name,shopid,price,img_sm,material,newUser,minus,yue,lv,sortid FROM elem_dish  WHERE shopid = '$_shopid' ";
    $_result = mysqli_query($_conn,$_sql);
    while(($_rows = mysqli_fetch_assoc($_result)) != NULL){
        $_output[] = $_rows;
    }  
    echo json_encode($_output);
?>