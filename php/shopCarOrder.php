<?php
//shopCarOrder.php 用于添加购物车
session_start();
//在用户登录成功时，使用session存储用户名
@$_uid = $_SESSION["userName"];
@$_orderid = getOrderId();
//rand(10000000000000,99999999999999);
@$_order_time = time() * 1000;
// @$_order_time = time()*1000+30*60*1000;
@$_num = $_GET["num"];
@$_price = $_GET["money"];
@$_orderDetails = $_GET["order"];
@$_shopName = $_GET["shopName"];

@$_orderTime = $_GET["orderTime"];
@$_DeliveryTime = $_GET["DeliveryTime"];

@$_DeliveryMoney = $_GET["DeliveryMoney"];
@$_Deliveryphone = $_GET["Deliveryphone"];
@$_DeliveryAddr = $_GET["DeliveryAddr"];

@$_remerks = $_GET["remerks"];

function getOrderId() {
	$_arr = array("q", "w", "e", "r", "t", "y", "u", "i", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "L", "K", "J", "H", "G", "F", "D", "S", "A", "Z", "X", "C", "V", "B", "N", "M");
	$_str = "";
	for ($i = 0; $i < 18; $i++) {
		$_str .= $_arr[rand(0, 62)];
	}
	return $_str;
}

$_conn = mysqli_connect("localhost", "root", "", "eellmmwangjinshuai");
if (!$_conn) {
	die("服务器连接错误");
}
$_sql = "SET NAMES UTF8";
mysqli_query($_conn, $_sql);
$_sql = "INSERT INTO shopcarorder (uid,orderid,orderTime,num,price,orderDetails,shopName,DeliveryMoney,Deliveryphone,DeliveryAddr,remerks) VALUES ('$_uid','$_orderid','$_order_time','$_num','$_price','$_orderDetails','$_shopName','$_DeliveryMoney','$_Deliveryphone','$_DeliveryAddr','$_remerks')";
$_result = mysqli_query($_conn, $_sql);

if ($_result) {
	$_output["result"] = "ok";
	//在数据库中获取到最新生成的订单编号 并返回
	$_output["orderid"] = $_orderid;
} else {
	$_output["result"] = "fail";
	$_output["msg"] = "添加失败" . $_sql;
}
echo json_encode($_output);
?>