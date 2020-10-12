<?php
    //该php文件用于main页面查询所有关键字商品
    $_output = array();
    @$_kw = $_REQUEST["kw"];
    //传值的时候 如果传0 则会进入下列条件判断。所有条件中应该指定不等于0 
    if(!$_kw && $_kw != 0){
        echo  json_encode($_output);
        return;
    }
    //$_kw 没有错误 也运行$_ke为0 
    $_conn = mysqli_connect("localhost","root","","eellmmwangjinshuai");
    $_sql = "SET NAMES UTF8";
    mysqli_query($_conn,$_sql);

    $_sql = "SELECT list.shopName,list.shopid,list.shop_img,dish.sid,dish.img_sm,dish.name,dish.price FROM  elem_dish AS dish LEFT JOIN store AS list ON list.shopid = dish.shopid WHERE dish.name LIKE '%$_kw%' ";
    //$_result 报错  证明 $_sql 查询语句有问题
    $_result = mysqli_query($_conn,$_sql);

    // $_rows = mysqli_fetch_assoc($_result);
    while( ($_rows = mysqli_fetch_assoc($_result)) != NULL){
        $_output[] = $_rows;
    }
    echo json_encode($_output);
?>