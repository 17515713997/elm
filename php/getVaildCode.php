<?php
    //设置请求头 --- 指定请求头的类型
    header("Content-Type:image/png");
    //开启服务器存储  session
    session_start();
    $_code = "";
    //随机生成几位数的验证码
    $_arr = array("q","w","e","r","t","y","u","i","p","a","s","d","f","g","h","j","k","l","z","x","c","v","b","n","m","1","2","3","4","5","6","7","8","9","0","Q","W","E","R","T","Y","U","I","O","P","L","K","J","H","G","F","D","S","A","Z","X","C","V","B","N","M");
    //生成几位验证码
    for($i = 0 ; $i < 4 ; $i++){
        //随机取一个0~62之间的整数
        $_num = rand(0,62);//rand(min,max)随机返回一个整数
        $_code.=$_arr[$_num];
    }
    //把生成的验证码，存储到服务器session中，方面对比
    $_SESSION["vaildCode"] = $_code;
    //开始绘图
    $_width = 100;
    $_height = 30;
    //创建一个大小为$_width和$_height大小图像
    $_img = imagecreatetruecolor($_width,$_height);
    //为图像填充背景色
        //创建颜色
    $_backColor = imagecolorallocate($_img,0,0,0);
        //填充颜色
        //为$_img在0,0,的位置开始填充$_backColor
    imagefill($_img,0,0,$_backColor);

    for($j = 0 ; $j < 4 ; $j++){
        $_textColor = imagecolorallocate($_img,rand(60,180),rand(60,180),rand(60,180));
        //把图片和验证码组合
        //imagechar(图片,font大小,x,y,字符串的第一个值,color)
        imagechar($_img,5,7+$j*25,8,$_code[$j],$_textColor);
    }
    //显示图片
    imagepng($_img);
    //销毁图片
    imagedestroy($_img);
?>