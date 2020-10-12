"use strict"//严格模式
var myApp = angular.module("myApp", [
    "ng",
    "ngAnimate",
    "ngRoute"
]);
//定义全局范围的控制器
myApp.controller("parentCtrl", ["$scope", "$location", "$http", "$routeParams", function ($scope, $location, $http, $routeParams) {
    $scope.jump = function (url) {
        $location.path(url);
    }
    $scope.hrefUrl = $location.absUrl().split("#")[0];
    console.log($scope.hrefUrl);
    //用户是否登录 定义全局函数 用来获取
    $scope.getuser = function () {
        $http.get("php/header.php").then(function (response) {
            if (response.data != null) {
                $scope.USER = response.data;
                console.log(response.data);
                //在取到用户名的时候，就向本地存储请求存储的数据
                $scope.eeeaaa();
                if ($scope.USER) {
                    window.localStorage.setItem($scope.hrefUrl, angular.toJson($scope.storageMsg));
                }
                return;
            } else {
                alert("请先登录");
            }
        })
    }
    $scope.eeeaaa = function () {
        $scope.storageMsg = window.localStorage.getItem($scope.hrefUrl) ? angular.fromJson(window.localStorage.getItem($scope.hrefUrl)) : {};
        //查找用户
        $scope.storageMsg[$scope.USER] = $scope.storageMsg[$scope.USER] ? $scope.storageMsg[$scope.USER] : {};
    }
    $scope.getuser();

    $scope.quit = function () {
        if (confirm("是否退出当前账号")) {
            $scope.USER = null;
        }
    }
}])
    //定义startCtrl
    .controller("startCtrl", ["$scope", "$interval", function ($scope, $interval) {
        $scope.msg = "这是start.html页面";
        $scope.num = 50;
        $scope.timeInterval = $interval(function () {
            $scope.num--;
            $scope.num1 = $scope.num;
        }, 1000, 50)
        //点击页面中的按钮直接跳转页面，越过倒计时
        $scope.timeInterval.then(function () {
            $scope.jump("/m");
        })
        //问题：当你点击按钮跳过main.html页面时，处于start.html页面的定时器还在执行，需要在离开start.html页面的时候，把定时器停止
        //在DOM元素从页面中移出时，angular.js将在$scope(范围作用域)中触发$destroy事件
        $scope.$on("$destroy", function () {
            alert("离开了start.html页面");
            //$interval 提供了 清除定时器事件
            alert($scope.num);
            $interval.cancel($scope.timeInterval);
        })
    }])
    //定义mainCtrl
    .controller("mainCtrl", ["$scope", "$http", function ($scope, $http) {
        console.log($scope.storageMsg);

        $scope.shopCount = 2;
        $scope.shopList = [];//默认装商品的集合
        $scope.kwList = [];//装搜索出来的数据集合
        $scope.preShop = null;
        //定义页面加载时，获取数据的函数
        $scope.getShopList = function () {
            $http.get("php/getShopList.php?start=" + $scope.shopList.length)
                .then(function (response) {
                    $scope.shopList = response.data;
                    //继续预加载几条数据
                    //因为预加载，所以需要在已经加载的数据之后开始加载数据
                    $scope.preLoading();
                })
        }
        $scope.getShopList();
        $scope.preLoading = function () {
            $http.get("php/getShopList.php?start=" + $scope.shopList.length + "&shopList=" + $scope.shopCount)
                .then(function (response) {
                    //预加载出来的数据应该有一个新的变量的来接收
                    $scope.preShop = response.data;
                    if ($scope.preShop.length == 0) {
                        $scope.isLoadMore = true;
                    }
                })
        }
        $scope.isLoadMore = false;
        $scope.loadMore = function () {
            //点击加载更多是的时候，为原有的数据的 $scope.dishList追加已经预加载出来的数据
            $scope.shopList = $scope.shopList.concat($scope.preShop);
            $scope.preShop = null;
            $scope.preLoading();
        }

        $scope.isLoadMoreShow = true;
        // //监听事件，监听数据kw的改变，只要有修改，就可以发送数据请求
        // //属于 2 直接显示数据 
        $scope.$watch("kw", function () {
            $http.get("php/dish_getBykw.php?kw=" + $scope.kw)
                .then(function (response) {
                    if (!$scope.kw && $scope.kw != "" && $scope.kw != undefined) return;
                    $scope.dishList = [];
                })


            //只要监听事件触发，我就应该让加载更多按钮消失
            $scope.isLoadMoreShow = true;
            if (!$scope.kw && $scope.kw != "" && $scope.kw != undefined) return;
            $scope.kwList = [];
            if ($scope.kw == "" || $scope.kw == undefined) {
                //正常取数据
                $scope.getShopList();
                $scope.isNoList = false;
                $scope.isLoadMoreShow = true;
            } else {
                $http.get("php/dish_getBykw.php?kw=" + $scope.kw)
                    .then(function (response) {
                        $scope.isLoadMoreShow = false;
                        //1、跳转页面显示数据 -- 必要条件 必须有搜索按钮
                        //2、直接显示数据 -- 只要数据改变就出现数据 -- 当前页面
                        if (response.data.length == 0) {
                            $scope.isNoList = true;
                            console.log("没有数据");
                        } else {
                            $scope.isNoList = false;
                        }
                        $scope.kwList = response.data;
                        $scope.shopList = [];
                    })
            }
        })
    }])

    .filter("irList", function () {//ir 信息检索
        //arr = 前台页面 谁调用了过滤器
        //keyName = 前台页面使用过滤器 传递的参数
        return function (arr, keyName) {
            //output 用来装去重后的数据
            //keyVal 用来装查询到的shopid值
            var output = [],
                keyVal = [];
            //angular.forEach ("需要循环的数组",function("从数组中取出的每一个值"){}) 
            angular.forEach(arr, function (item) {
                // console.log(item[keyName]);
                if (keyVal.indexOf(item[keyName]) === -1) {
                    keyVal.push(item[keyName]);
                    output.push(item);
                }
            })
            return output;
        }
    })
    //定义detailsCtrl
    .controller("detailsCtrl", ["$scope", "$routeParams", "$http", function ($scope, $routeParams, $http) {
        $scope.msg = "这是details.html页面";
        console.log($routeParams);//{sid: "1"}
        $http.get("php/dish_getBySid.php?sid=" + $routeParams.sid)
            .then(function (response) {
                //数组需要循环
                //$scope.dish_sid = response.data;//数组
                //对象直接取值
                $scope.dish = response.data[0];//对象
            })
    }])
    //定义orderCtrl
    .controller("orderCtrl", ["$scope", "$routeParams", "$http", function ($scope, $routeParams, $http) {
        $scope.msg = "这是order.html页面";
        //angular.toJson    把js对象/数组 转换为json数据
        //angular.fromJson  把json数据转换为js对象/数组
        // console.log(angular.fromJson($routeParams.shop));
        $scope.a = "支付宝";
        $scope.b = "微信支付";

        $scope.zfb = function () {
            $scope.zxzf = $scope.a;
            $(".qian1").prop("checked", true);
            $(".qian2").prop("checked", false);
            $(".ding").fadeOut();
        }
        $scope.wx = function () {
            $scope.zxzf = $scope.b;
            $(".qian1").prop("checked", false);
            $(".qian2").prop("checked", true);
            $(".ding").fadeOut();
        }
        if (!$scope.zxzf) {
            $scope.zxzf = "请选择支付方式";
        }
        $scope.aaa = $routeParams.orderid;
        $scope.bbb = $scope.storageMsg[$scope.USER][$scope.aaa].shop;
        $scope.ccc = $scope.storageMsg[$scope.USER][$scope.aaa].money;
        $scope.ddd = $scope.storageMsg[$scope.USER][$scope.aaa].allNum;
        $http.get("php/allAddress.php?userName='当前登录的用户名'")
            .then(function (response) {
                $scope.arr = [];
                if (response.data == "请先登录") {
                    alert("请先登录");
                } else if (response.data.length > 0 && angular.isArray(response.data)) {
                    for (var i = 0; i < response.data.length; i++) {
                        if (response.data[i].defaultAddr == 1) {
                            $scope.address = $scope.arr;
                            $scope.arr.push(response.data[i]);
                            break;
                        }
                    }
                    if ($scope.arr.length == 0) {
                        $scope.address = "添加新增地址";
                    }
                    return;
                }
                $scope.address = "添加新增地址";
            }, function (error) {
                console.log(error);
                alert("错了");
            })
        $scope.remerks = "口味、偏好";
        $scope.backu = ["不辣","微辣","中辣","重辣","麻辣","变态辣","多糖","多盐","放几根烟"];
        $scope.bac = function(l){
            $scope.remerks = l;
        }
        
        $scope.pay = function () {
            if ($scope.address == "添加新增地址") {
                alert("请添加地址");
                return;
            }
            if ($(".qian1")[0].checked == true || $(".qian2")[0].checked == true) {
                $http.get("php/shopCarOrder.php?num=" + $scope.ddd + "&money=" + $scope.ccc + "&order=" + angular.toJson($scope.bbb) + "&shopName=" + $scope.aaa + "&Deliveryphone=" + $scope.address[0].tel + "&DeliveryAddr=" + $scope.address[0].address + $scope.address[0].Doorplate + "&DeliveryMoney=" + $scope.DeliveryMoney+"&remerks="+$scope.remerks)
                    .then(function (response) {
                        console.log($scope.DeliveryMoney);
                        console.log($scope.remerks);
                        console.log(response.data);
                        $scope.orderid = response.data.orderid;
                        alert("进");
                        if ($scope.zxzf == $scope.a) {
                            $scope.jump("/zfb/" + $scope.orderid);
                        }
                        if ($scope.zxzf == $scope.b) {
                            $scope.jump("/wx/" + $scope.orderid);
                        }
                    })
            } else {
                alert("请选择支付方式");
            }
        }

        //获取当前的配送时间 + 30分钟
        $scope.payTimer = new Date(new Date().getTime() + 30 * 60 * 1000);
        //赋值
        $scope.DeliveryMoney = $scope.payTimer.getTime();
        //获取对比的时间 contrast 对比
        $scope.contrastTime = $scope.payTimer.getTime();
        //设置开店时间 -- 从数据库获取 当前店铺的开店时间
        $scope.openShop = 9.5;
        //获取/设置闭店时间 -- 从数据库获取 当前店铺的闭店时间
        $scope.stopShop = 22;
        //每天开始派送 -- 闭店 之间所有 派送时间点数组
        $scope.roundTime = [];
        for ($scope.i = 0; $scope.i <= ($scope.stopShop - $scope.openShop) * 6; $scope.i++) {
            $scope.roundTime.push($scope.i);
        }
        //配送几天的周数组
        $scope.week = [0, 1, 2, 3, 4, 5, 6];
        //如果下单时间 < 开店时间 则显示 今天9点30配送
        //如果下单时间+0分钟 < 开店时间
        //则 day+1 9点30配送
        //如果下单时间 > 闭店时间 则显示 第二天9点30配送
        //提示：以上2个事情，也可以按照毫秒值进条件对比
        //如果订餐时间 小于 开店时间，则直接显示开店配送时间
        $scope.timeTrue = false;
        if ($scope.payTimer.getHours() < 9) {
            if (($scope.payTimer.getHours() + ($scope.payTimer.getMinutes()) / 60) >= 0) {
                $scope.selectTime = new Date(new Date($scope.payTimer.getFullYear(), $scope.payTimer.getMonth(), $scope.payTimer.getDate() + 1).getTime() + $scope.openShop * 60 * 60 * 1000);
                $scope.timeTrue = true;
            } else {
                $scope.selectTime = new Date(new Date($scope.payTimer.getFullYear(), $scope.payTimer.getMonth(), $scope.payTimer.getDate()).getTime() + $scope.openShop * 60 * 60 * 1000);
                $scope.timeTrue = false;
            }
        }
        //如果下单时间大于 闭店时间 ， 则直接显示第二天时间，并且让配送时间显示为第二天的配送时间
        if (($scope.payTimer.getHours() + ($scope.payTimer.getMinutes()) / 60) > 22) {
            $scope.selectTime = new Date(new Date($scope.payTimer.getFullYear(), $scope.payTimer.getMonth(), $scope.payTimer.getDate() + 1).getTime() + $scope.openShop * 60 * 60 * 1000);
            $scope.timeTrue = true;
        }
        $scope.dropDownTabs = function (ev, k) {
            var ev = ev || window.event;
            ev.preventDefault();
            $(".tab-content ul").hide().eq(k).show();
        }
        $scope.getPayTime = function (e) {
            var e = e || window.event;
        }
        $scope.HHmm = function (event) {
            var event = event || window.event;
            $(".delivery-select .song").text($(event.target).text());
            $(".ms").fadeOut();
            $(".Time").fadeOut();
        }
    }])
    // 返回n天的开店时间 到下单时间之间的配送时间点的毫秒值
    .filter("setMilliSecond", function () {
        return function (open, j, data) {
            var getTimer = new Date();
            // 获取j天的0点0份0秒
            var tempTime = new Date(getTimer.getFullYear(), getTimer.getMonth(), (getTimer.getDate() + j));
            // 获取计算后的 每一个传进来的间隔时间点
            var payTime = new Date(tempTime.getTime() + open * 60 * 60 * 1000 + data);
            return payTime;
        }
    })
    // //星期的过滤
    .filter("setWeek", function () {
        return function (k) {
            //  获取当前时间
            var getTimer = new Date();
            var getDay = getTimer.getDay() + k;
            var day = null;
            switch (getDay % 7) {//getDay%7 = 0 1 2 3 4 5 6 
                case 0: day = "周日"; break;
                case 1: day = "周一"; break;
                case 2: day = "周二"; break;
                case 3: day = "周三"; break;
                case 4: day = "周四"; break;
                case 5: day = "周五"; break;
                case 6: day = "周六"; break;
            }
            //  先获取到对应的日期 今天 明天 以及后面的时间
            var tempTime = new Date(getTimer.getFullYear(), getTimer.getMonth(), (getTimer.getDate() + k));
            var tempDay = k > 1 ? (tempTime.getMonth() + 1 + "-") + (tempTime.getDate() < 10 ? "0" + tempTime.getDate() : tempTime.getDate()) + "(" + day + ")" : k == 1 ? "明天(" + day + ")" : "今天(" + day + ")";
            return tempDay;
        }
    })
    .filter("setPayTime", function () {
        // open开店时间  j第几天 data间隔时间 
        return function (open, j, data) {
            var getTimer = new Date();
            // 获取j天的0点0份0秒
            var tempTime = new Date(getTimer.getFullYear(), getTimer.getMonth(), (getTimer.getDate() + j));
            // 获取计算后的 每一个传进来的间隔时间点
            var payTime = new Date(tempTime.getTime() + open * 60 * 60 * 1000 + data);
            return payTime;
        }
    })
    .controller("payCtrl", ["$scope", "$http", "$routeParams", "$interval", "$filter", function ($scope, $http, $routeParams, $interval, $filter) {
        $scope.msg = "这是pay.html页面";
        $scope.orderid = $routeParams.orderid;
        $scope.dang = new Date().getTime();
        $http.get("php/getOrder.php?orderid=" + $scope.orderid)
            .then(function (response) {
                console.log(response.data);
                $scope.fff = angular.fromJson(response.data[0].orderDetails);
                $scope.shop = response.data[0];

                $scope.at = response.data[0].DeliveryMoney;
                $scope.ta = response.data[0].orderTime;
                $scope.vvv = $scope.dang - $scope.ta;
                $scope.ba = 15 * 60 * 1000;
                $scope.nu = ($scope.ba - $scope.vvv) / 1000;
                $scope.timeInterval = $interval(function () {
                    $scope.nu--;
                    $(".DaTe").text($filter('date')($scope.nu * 1000, 'mm:ss'));
                    if ($scope.nu <= 0) {
                        $scope.nu = "订单已超时";
                        $interval.cancel($scope.timeInterval);
                        $("#ababa").addClass("wangjinshuai");
                        $("#ababa").text("订单已超时");
                        $("#ababa").attr("href", "javascript:;");
                        alert("ss");
                        $scope.jump("/noPay/" + $scope.orderid);
                    }
                }, 1000)
            })

        $scope.li1 = function () {
            $(".money1").prop("checked", true);
            $(".money2").prop("checked", false);
        }
        $scope.li2 = function () {
            $(".money1").prop("checked", false);
            $(".money2").prop("checked", true);
        }
        $scope.fu = function () {
            if ($(".money1")[0].checked == true) {
                $scope.jump("/zfb/" + $scope.orderid);
            }
            if ($(".money2")[0].checked == true) {
                $scope.jump("/wx/" + $scope.orderid);
            }
        }
    }])
    //定义myOrderCtrl
    .controller("myOrderCtrl", ["$scope", "$routeParams", function ($scope, $routeParams) {
        // console.log($scope.orderid);
        $scope.dizhi = function () {
            alert("zai");
        }
    }])
    //定义registerCtrl
    .controller("registerCtrl", ["$scope", function ($scope) {
        $scope.msg = "这是register.html页面";
    }])
    //定义loginCtrl
    .controller("loginCtrl", ["$scope", function ($scope) {
        $scope.msg = "这是login.html页面";
    }])
    //定义phone_loginCtrl
    .controller("phone_loginCtrl", ["$scope", function ($scope) {
        $scope.msg = "这是phone_login.html页面";
    }])
    //定义shopUser_loginCtrl
    .controller("shopUser_loginCtrl", ["$scope", function ($scope) {
        $scope.msg = "这是shopUser_login.html页面";
    }])

    //定义shopUser_loginCtrl
    .controller("kwCtrl", ["$scope", "$http", function ($scope, $http) {
        $scope.shopCount = 2;
        $scope.shopList = [];//默认装商品的集合
        $scope.kwList = [];//装搜索出来的数据集合
        $scope.preShop = null;
        //定义页面加载时，获取数据的函数
        $scope.getShopList = function () {
            $http.get("php/getShopList.php?start=" + $scope.shopList.length)
                .then(function (response) {
                    $scope.shopList = response.data;
                    //继续预加载几条数据
                    //因为预加载，所以需要在已经加载的数据之后开始加载数据
                    $scope.preLoading();
                })
        }
        $scope.getShopList();
        $scope.preLoading = function () {
            $http.get("php/getShopList.php?start=" + $scope.shopList.length + "&shopList=" + $scope.shopCount)
                .then(function (response) {
                    //预加载出来的数据应该有一个新的变量的来接收
                    $scope.preShop = response.data;
                    if ($scope.preShop.length == 0) {
                        $scope.isLoadMore = true;
                    }
                })
        }
        $scope.isLoadMore = false;
        $scope.loadMore = function () {
            //点击加载更多是的时候，为原有的数据的 $scope.dishList追加已经预加载出来的数据
            $scope.shopList = $scope.shopList.concat($scope.preShop);
            $scope.preShop = null;
            $scope.preLoading();
        }

        $scope.isLoadMoreShow = true;
        // //监听事件，监听数据kw的改变，只要有修改，就可以发送数据请求
        // //属于 2 直接显示数据 
        $scope.$watch("kw", function () {
            $http.get("php/dish_getBykw.php?kw=" + $scope.kw)
                .then(function (response) {
                    if (!$scope.kw && $scope.kw != "" && $scope.kw != undefined) return;
                    $scope.dishList = [];
                })
            //只要监听事件触发，我就应该让加载更多按钮消失
            $scope.isLoadMoreShow = true;
            if (!$scope.kw && $scope.kw != "" && $scope.kw != undefined) return;
            $scope.kwList = [];
            if ($scope.kw == "" || $scope.kw == undefined) {
                //正常取数据
                $scope.getShopList();
                $scope.isNoList = false;
                $scope.isLoadMoreShow = true;
            } else {
                $http.get("php/dish_getBykw.php?kw=" + $scope.kw)
                    .then(function (response) {
                        $scope.isLoadMoreShow = false;
                        //1、跳转页面显示数据 -- 必要条件 必须有搜索按钮
                        //2、直接显示数据 -- 只要数据改变就出现数据 -- 当前页面
                        if (response.data.length == 0) {
                            $scope.isNoList = true;
                            console.log("没有数据");
                        } else {
                            $scope.isNoList = false;
                        }
                        $scope.kwList = response.data;
                        $scope.shopList = [];
                    })
            }
        })
    }])
    //定义phone_registerCtrl
    .controller("phone_registerCtrl", ["$scope", function ($scope) {
        $scope.msg = "这是phone_register.html页面";
    }])
    //定义shopCarCtrl
    .controller("shopCarCtrl", ["$scope", function ($scope) {
        $scope.msg = "这是shopCar.html页面";
    }])
    //定义shopMainCtrl
    .controller("shopMainCtrl", ["$scope", "$http", "$routeParams", "$location", function ($scope, $http, $routeParams, $location) {
        //1、判断内存中是否存有数据，是：取数据。否，创建一个空数组
        //2、判断数据库中是否有没结算的商品，1、获取。2、创建一个空数组
        // if (false) {//判断  1或者2的条件

        // } else {
        //     $scope.shopCarList = [];//局部购物车
        // }
        $http.get("php/getShopId.php?shopid=" + $routeParams.shopid)
            .then(function (response) {
                $scope.shopping = response.data[0];//对象直接取值
                //判断店铺是否存在
                if ($scope.storageMsg[$scope.USER][$scope.shopping.shopName]) {
                    if ($scope.storageMsg[$scope.USER][$scope.shopping.shopName].shop) {
                        $scope.shopCarList = $scope.storageMsg[$scope.USER][$scope.shopping.shopName].shop;
                    } else {
                        $scope.storageMsg[$scope.USER][$scope.shopping.shopName].shop = [];
                        $scope.shopCarList = [];
                    }
                } else {
                    $scope.storageMsg[$scope.USER][$scope.shopping.shopName] = {};
                    $scope.storageMsg[$scope.USER][$scope.shopping.shopName].shop = [];
                    $scope.shopCarList = [];
                }
                $scope.money = $scope.storageMsg[$scope.USER][$scope.shopping.shopName].money || 0;
                $scope.allNum = $scope.storageMsg[$scope.USER][$scope.shopping.shopName].allNum || 0;
            })
        //先请求页面中分类数据
        $http.get("php/getShopSort.php?shopid=" + $routeParams.shopid)
            .then(function (response) {
                $scope.shopSort = response.data;
            })
        //店铺内所有的菜品
        $http.get("php/getShopDishById.php?shopid=" + $routeParams.shopid)
            .then(function (response) {
                for ($scope.j = 0; $scope.j < response.data.length; $scope.j++) {
                    response.data[$scope.j].num = 0;
                    for ($scope.k = 0; $scope.k < $scope.shopCarList.length; $scope.k++) {
                        if (response.data[$scope.j].name == $scope.shopCarList[$scope.k].name && response.data[$scope.j].price == $scope.shopCarList[$scope.k].price) {
                            response.data[$scope.j].num = $scope.shopCarList[$scope.k].num;
                        }
                    }
                }
                $scope.shopList = response.data;//对象
            })
        $scope.checkNum = function (sign, obj) {
            switch (sign) {
                case "+"://添加商品
                    ++obj.num;//数量++
                    ++$scope.allNum;//购买数量++
                    $scope.money += obj.price * 1;//总价++
                    //购物车++
                    $scope.shopCarAdd(obj);
                    return;
                case "-"://添删除商品
                    --obj.num;//数量--
                    --$scope.allNum;//购买数量--
                    $scope.money -= obj.price * 1;//总价--
                    //购物车--
                    $scope.shopCarRemove(obj);
                    return;
            }
        }
        //购物车++
        $scope.shopCarAdd = function (obj) {
            //添加商品的 shopid 名字 数量 价格
            for ($scope.i = 0; $scope.i < $scope.shopCarList.length; $scope.i++) {
                if ($scope.shopCarList[$scope.i].shopid == obj.shopid && $scope.shopCarList[$scope.i].name == obj.name && $scope.shopCarList[$scope.i].price == obj.price && $scope.shopCarList[$scope.i].sid == obj.sid) {
                    $scope.shopCarList[$scope.i].num = obj.num;
                    break;
                }
            }
            //当i == 数组长度的时候，证明上面的循环没查到相同的数据，则从下面的判断中 增加数据
            if ($scope.shopCarList.length == $scope.i) {
                $scope.shopCarList.push(obj);
            }
        }
        //购物车--
        $scope.shopCarRemove = function (obj) {
            //当商品数量为1是。删除商品
            //当商品数量为>1时，商品数量-1
            // $scope.shopCarList
            //jq提供了在数组对象删除某一个特定位置元素的方法，返回的是不需要删除值
            //jquery.grep(arr,function(a 数组的值,下标index){
            //通过 return 返回不是aaaa值;
            //return a != aaaa;    
            //})
            for ($scope.i = 0; $scope.i < $scope.shopCarList.length; $scope.i++) {
                if ($scope.shopCarList[$scope.i].shopId == obj.shopId && $scope.shopCarList[$scope.i].name == obj.name && $scope.shopCarList[$scope.i].price == obj.price && $scope.shopCarList[$scope.i].sid == obj.sid) {
                    if ($scope.shopCarList[$scope.i].num > 0) {
                        $scope.shopCarList[$scope.i].num = obj.num;
                    } else {
                        $scope.shopCarList = $.grep($scope.shopCarList, function (a) {
                            return a != obj;
                            //$scope.shopCarList[$scope.i] == obj
                        })
                    }
                }
            }
        }
        $scope.commentBtn = function () {
            $scope.jump("/b/" + $scope.shopping.shopName);
            alert("跳");
        }
        $scope.$on("$destroy", function () {
            //把店铺上面的购物车数据直接赋值给本地存储内对应店铺的shop数据即可
            $scope.storageMsg[$scope.USER][$scope.shopping.shopName].money = $scope.money;
            $scope.storageMsg[$scope.USER][$scope.shopping.shopName].allNum = $scope.allNum;
            $scope.storageMsg[$scope.USER][$scope.shopping.shopName].shop = $scope.shopCarList;
            //保存本地存储
            window.localStorage.setItem($scope.hrefUrl, angular.toJson($scope.storageMsg));
            console.log($scope.money);
            if($scope.money >= 17){
                $scope.money = $scope.money  -  17 ;
                $scope.fumoney = angular.toJson($scope.money);
                console.log($scope.fumoney);
            }else{
                $scope.money = $scope.money;
                console.log($scope.money);
            }
        })
        
        
    }])
    //定义shopUser_loginCtrl
    .controller("shopUser_loginCtrl", ["$scope", function ($scope) {
        $scope.msg = "这是shopUser_login.html页面";
    }])
    //定义shopUser_registerCtrl
    .controller("shopUser_registerCtrl", ["$scope", function ($scope) {
        $scope.msg = "这是shopUser_register.html页面";
    }])
    //定义等待支付页面
    .controller("waitPayCtrl", ["$scope", "$http", "$routeParams", "$interval", "$filter", function ($scope, $http, $routeParams, $interval, $filter) {
        $scope.msg = "这是waitPay.html页面";
        $scope.orderid = $routeParams.orderid;
        $scope.dang = new Date().getTime();
        $http.get("php/getOrder.php?orderid=" + $scope.orderid)
            .then(function (response) {
                $scope.fff = angular.fromJson(response.data[0].orderDetails);
                $scope.shop = response.data[0];
                $scope.sss = $scope.fff[0].img_sm;
         })
        $scope.ding = function () {
            $scope.jump("/house");
        }
        $scope.zfb = function () {
            $scope.jump("/zfb/" + $scope.orderid);
        }
        $scope.xiu = function () {
            alert("嗯");
        }
        $scope.xiao = function () {
            if (confirm("是否取消订单")) {
                var msg = { 'orderState': 5, 'orderid': $scope.orderid };
                $http.post("php/upDataOrderStata.php", msg)
                    .then(function (response) {
                        console.log(response.data);
                    })
                $scope.orderState = "5";
                $scope.jump("/noPay/" + $scope.orderid);
                return;
            }

        }
    }])
    //定义noPayCtrl
    .controller("noPayCtrl", ["$scope", "$http", "$routeParams", function ($scope, $http, $routeParams) {
        $scope.msg = "这是noPay.html页面";
        $scope.orderid = $routeParams.orderid;
        $http.get("php/getOrder.php?orderid=" + $scope.orderid)
            .then(function (response) {
                console.log(response.data);
                $scope.fff = angular.fromJson(response.data[0].orderDetails);
                $scope.shop = response.data[0];
                console.log($scope.fff);
                console.log($scope.shop);
            })
        $scope.tiao = function () {
            $scope.id = $scope.fff[0].shopid;
            console.log($scope.id);
            $scope.jump("/g/" + $scope.id);
            localStorage.clear();
        }
        $scope.ding = function () {
            $scope.jump("/house");
        }

    }])
    //定义支付宝Ctrl
    .controller("zfbCtrl", ["$scope", "$http", "$routeParams", function ($scope, $http, $routeParams) {
        $scope.msg = "这是zfb.html页面";
        $scope.orderid = $routeParams.orderid;
        console.log($routeParams.orderid);
        $http.get("php/getOrder.php?orderid=" + $scope.orderid)
            .then(function (response) {
                $scope.fff = angular.fromJson(response.data[0].orderDetails);
                $scope.shop = response.data[0];
            })
        $scope.colse = function () {
            $scope.jump("pay/" + $scope.orderid);
        }
        $scope.a = function () {
            $http.get("php/getverify.php?userName=" + $scope.USER)
                .then(function (response) {
                    $scope.a = response.data;
                    console.log($scope.a.m.verify);
                    if ($scope.a.m.verify == "") {
                        $scope.jump("/yyy/" + $routeParams.orderid);
                    } else {
                        $(".hidee span").each(function () {
                            var i = 0;
                            $(".hidee span").on("click", function () {
                                var a = document.querySelectorAll(".output span");
                                var ccc = $(this).text();
                                a[i].innerHTML = ccc;
                                i++;
                                if (i == 6) {
                                    var a = document.querySelectorAll(".output span");
                                    var k = [];
                                    for (var m = 0; m < a.length; m++) {
                                        k.push(a[m].innerHTML);
                                        if (k.length == 6) {
                                            var ll = k.join("");
                                            if (ll == $scope.a.m.verify) {
                                                var msg = {
                                                    'orderState': 1,
                                                    'orderid': $routeParams.orderid
                                                };
                                                console.log($routeParams.orderid);
                                                $http.post("php/upDataOrderStata.php", msg)
                                                    .then(function (response) {
                                                        console.log(response.data);
                                                        $scope.jump("/house");
                                                    })
                                                alert("？？？？？？？");
                                                k = [];
                                                i = 0;
                                                for (var c = 0; c < a.length; c++) {
                                                    a[c].innerHTML = "";
                                                }
                                            } else {
                                                k = [];
                                                i = 0;
                                                for (var j = 0; j < a.length; j++) {
                                                    a[j].innerHTML = "";
                                                }
                                            }
                                        }
                                    }
                                }
                            })
                            $(".hidee em").on("click", function () {
                                var a = document.querySelectorAll(".output span");
                                i = i - 1;
                                a[i].innerHTML = "";
                            })
                        })
                    }
                })
        }
    }])
    //定义微信Ctrl
    .controller("wxCtrl", ["$scope", "$http", "$routeParams", function ($scope, $http, $routeParams) {
        $scope.msg = "这是wx.html页面";
        $scope.orderid = $routeParams.orderid;
        $http.get("php/getOrder.php?orderid=" + $scope.orderid)
            .then(function (response) {
                $scope.fff = angular.fromJson(response.data[0].orderDetails);
                $scope.shop = response.data[0];
            })
        $scope.b = function () {
            $http.get("php/getverify.php?userName=" + $scope.USER)
                .then(function (response) {
                    $scope.a = response.data;
                    //console.log($scope.a.m.verify);
                    if ($scope.a.m.verify == "") {
                        $scope.jump("/yyy/" + $routeParams.orderid);
                    } else {
                        $(".hidee span").each(function () {
                            var i = 0;
                            $(".hidee span").on("click", function () {
                                var a = document.querySelectorAll(".output span");
                                var ccc = $(this).text();
                                a[i].innerHTML = ccc;
                                i++;
                                if (i == 6) {
                                    var a = document.querySelectorAll(".output span");
                                    var k = [];
                                    for (var m = 0; m < a.length; m++) {
                                        //console.log(a[m].innerHTML);
                                        k.push(a[m].innerHTML);
                                        //console.log(k);
                                        if (k.length == 6) {
                                            var ll = k.join("");
                                            if (ll == $scope.a.m.verify) {
                                                var msg = {
                                                    'orderState': 1,
                                                    'orderid': $routeParams.orderid
                                                };
                                                console.log($routeParams.orderid);
                                                $http.post("php/upDataOrderStata.php", msg)
                                                    .then(function (response) {
                                                        console.log(response.data);
                                                        $scope.jump("/house");
                                                    })
                                                alert("!!!!!!");
                                                k = [];
                                                i = 0;
                                                for (var c = 0; c < a.length; c++) {
                                                    a[c].innerHTML = "";
                                                }
                                            } else {
                                                k = [];
                                                i = 0;
                                                for (var j = 0; j < a.length; j++) {
                                                    a[j].innerHTML = "";
                                                }
                                            }
                                        }
                                    }
                                }
                            })
                            $(".hidee em").on("click", function () {
                                var a = document.querySelectorAll(".output span");
                                i = i - 1;
                                a[i].innerHTML = "";
                            })
                        })
                    }
                })
        }
    }])
    //定义底部订单页
    .controller("houseCtrl", ["$scope", "$http", "$routeParams", "$interval", "$filter", "$rootScope", function ($scope, $http, $routeParams, $interval, $filter, $rootScope) {
        $http.get("php/house.php?num=" + $scope.ddd + "&money=" + $scope.ccc + "&order=" + angular.toJson($scope.bbb) + "&shopName=" + $scope.aaa + "&orderState=" + $scope.orderState)
            .then(function (response) {
                $scope.data = response.data;
                console.log($scope.data);
                for ($scope.j = 0; $scope.j < $scope.data.length; $scope.j++) {
                    $scope.data[$scope.j].orderDetails = angular.fromJson($scope.data[$scope.j].orderDetails);
                    $scope.orderState($scope.data[$scope.j]);
                    $rootScope.filterOrderTime($scope.data[$scope.j]);
                }
                $scope.go = function (p) {
                    $scope.id = angular.fromJson(p.orderDetails)[0].shopid;
                    $scope.jump("/g/" + $scope.id);
                    localStorage.clear();
                }
                $scope.pay = function (p) {
                    $scope.jump("/zfb/" + p.orderid);
                }
                $scope.take = function (p) {
                    if (confirm("是否确认收货")) {
                        var msg = { 'orderState': 2, 'orderid': p.orderid };
                        $http.post("php/upDataOrderStata.php", msg)
                            .then(function (response) {
                                console.log(response.data);
                            })
                        p.orderState = "2";
                        return;
                    }
                }
                $scope.comment = function (p) {
                    if (confirm("是否默认好评")) {
                        var msg = { 'orderState': 3, 'orderid': p.orderid };
                        $http.post("php/upDataOrderStata.php", msg)
                            .then(function (response) {
                                console.log(response.data);
                            })
                        p.orderState = "3";
                        return;
                    }
                }
            })
        //根据订单下单时间，修改页面中的默认时间状态
        //当前函数在多个页面中都有使用，则定义为全局函数
        $rootScope.filterOrderTime = function (obj) {
            //获取当前时间
            let currentTime = new Date();
            //获取订单时间
            let orderTime = obj.orderTime;
            //console.log(orderTime);
            //获取时间差
            let differrnce = currentTime.getTime() - orderTime;
            //console.log(differrnce);
            if (differrnce < 15 * 50 * 1000 && obj.orderState === "0") {
                //时间低于15分钟 定时器 换算时间 返回给原数据
                //HH:mm
                //获取距离15分钟还差多少秒
                //定时器执行多少次 roundTime 时间相差400秒 则执行400次
                var roundTime = (15 * 60 * 1000 - differrnce) / 1000;
                //相差时间 秒数
                var tempTime = roundTime;
                var temp = function () {
                    tempTime--;
                    var mm = parseInt(tempTime / 60) >= 10 ? parseInt(tempTime / 60) : "0" + parseInt(tempTime / 60);
                    var ss = parseInt(tempTime % 60) >= 10 ? parseInt(tempTime % 60) : "0" + parseInt(tempTime % 60);
                    var str = mm + ":" + ss;
                    if (tempTime < 0) {
                        //停止定时器
                        $interval.cancel(obj.interval);
                        //改变时间为下单时间
                        // obj.orderTime = $filter("date")(obj.orderTime,"yyyy/MM/dd/HH:mm");
                        str = $filter("date")(orderTime, "yyyy/MM/dd/HH:mm");
                        var msg = { 'orderState': 4, 'orderid': obj.orderid };
                        $http.post("php/upDataOrderStata.php", msg);
                        //改变订单状态为4
                        obj.orderState = "4";
                    }
                    obj.orderTime = str;
                }
                //立刻执行一次temp函数
                temp();
                //在用定时器调用temp函数roundTime次，间隔一秒
                obj.interval = $interval(temp, 1000, roundTime);
            } else {
                //时间超过15分钟的订单，直接转换成 年月日 时分秒 格式返回给原数据
                obj.orderTime = $filter("date")(obj.orderTime, "yyyy/MM/dd/HH:mm");
                // str = $filter("date")(obj.orderTime,"yyyy/MM/dd/HH:mm");

                //从新定义一个时间 给当前对象，页面中的时间使用当前时间即可
                //obj.newOrderTime = $filter("date")(obj.orderTime,"yyyy/MM/dd/HH:mm");
            }
        }
        //orderStart == 0 "未支付"
        //orderStart == 1 "配送中"
        //orderStart == 2 "待评价"
        //orderStart == 3 "已完成"
        //orderStart == 4 "超时取消"
        //orderStart == 5 "手动取消"
        //确认要修改的订单 修改当前的状态

        //修改订单数据的 订单状态
        $scope.orderState = function (data) {
            //状态为0 支付时间超过15分钟 修改状态已取消
            //console.log(data);
            //取到每一条数据的订单状态
            //console.log(data.orderState);
            //获取到订单的下单时间
            //console.log(data.orderTime);
            //获取本地当前时间
            var currentTime = new Date();
            //console.log(currentTime);
            //状态为0(支付为支付) 支付时间超过15分钟 修改状态已取消(超时)
            //订单支付时间差
            var differrnce = currentTime.getTime() - data.orderTime;
            //console.log(differrnce);
            if (data.orderState === "0" && differrnce > 15 * 60 * 1000) {
                //修改数据库状态
                //修改当前对象状态
                var msg = { 'orderState': 4, 'orderid': data.orderid };
                //在php中接收数据只能使用$_REQUEST[];
                // $http.post("php/upDataOrderStata.php?key="+val)
                $http.post("php/upDataOrderStata.php", msg)
                    .then(function (response) {
                        console.log(response.data);
                    })
                data.orderState = "4";
                return;
            }
            //订单状态为1(配送中) 配送时间超过24小时
            if (data.orderState === "1" && differrnce > 24 * 60 * 60 * 1000) {
                //修改数据库状态
                //修改当前对象状态
                // 2 待评价
                var msg = { 'orderState': 2, 'orderid': data.orderid };
                //在php中接收数据只能使用$_REQUEST[];
                // $http.post("php/upDataOrderStata.php?key="+val)
                $http.post("php/upDataOrderStata.php", msg)
                    .then(function (response) {
                        console.log(response.data);
                    })
                data.orderState = "2";
                return;
            }
            if (data.orderState === "2" && differrnce > 48 * 60 * 60 * 1000) {
                //修改数据库状态
                //修改当前对象状态
                // 3 已完成
                var msg = { 'orderState': 3, 'orderid': data.orderid };
                //在php中接收数据只能使用$_REQUEST[];
                // $http.post("php/upDataOrderStata.php?key="+val)
                $http.post("php/upDataOrderStata.php", msg)
                    .then(function (response) {
                        console.log(response.data);
                    })
                data.orderState = "3";
                return;
            }
        }
    }])
//定义post传输方式,以便php可以通过$_POST[]方法接收数据
myApp.config(["$httpProvider", function ($httpProvider) {
    //定义$httpProvider的默认方式
    $httpProvider.defaults.transformRequest = function (data) {
        if (data === undefined) {
            return data;
        }
        return $.param(data);
    }
    //设置post请求头
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
}])
    //定义shopUserCtrl
    .controller("shopUserCtrl", ["$scope", function ($scope) {
        $scope.msg = "这是shopUser.html页面";
    }])
    //定义addCtrl
    .controller("addrCtrl", ["$scope", "$http", "$routeParams", function ($scope, $http, $routeParams) {
        $scope.orderid = $routeParams.orderid;
        console.log($scope.orderid);
        $http.get("php/allAddress.php?userName='当前登录的用户名'")
            .then(function (response) {
                //console.log(response.data);//[]
                if (response.data == "请先登录") {
                    alert("请先登录");
                } else if (response.data.length > 0 && angular.isArray(response.data)) {
                    $scope.allAddress = response.data;//array
                    return;
                }
                $scope.allAddress = "请添加地址";//string
            }, function (error) {
                console.log(error);
                alert("错了");
            })
        $scope.newAddr = function () {
            $scope.jump("/newAddr/" + $scope.orderid);
        }
        $scope.upDateAddr = function (obj) {
            console.log(obj);
            $scope.upDate = angular.toJson({ "upid": $scope.orderid, "obj": obj });
            console.log($scope.upDate);
            $scope.jump('/newAddr/' + $scope.upDate);
        }
        $scope.defaultAddr = function (addr) {
            $http.get("php/defaultAddr.php?aid=" + addr.aid)
                .then(function (response) {
                    $scope.jump('/b/' + $scope.orderid);
                })
        }
    }])
    //判断类型是不是数组，该过滤器可以用于前台页面进行过滤
    .filter("isTypeArray", function () {
        return function (arr) {
            if (angular.isArray(arr)) {
                return true;
            } else {
                return false;
            }
        }
    })
    //
    .controller("yyyCtrl", ["$scope", "$http", "$routeParams", function ($scope, $http, $routeParams) {
        alert("aaa");
        console.log($routeParams.orderid);
        $scope.ru = function () {
            if ($scope.ddd) {
                var aaa = /^\d{6}$/;
                if (aaa.test($scope.ddd)) {
                    $http.get("php/verify.php?userName=" + $scope.USER + "&in=" + $scope.ddd).then(function (response) {
                        console.log(response.data);
                        if (response.data.ok == "ok"){
                            $scope.jump("/zfb/" + $routeParams.orderid);
                        }
                    })
                }
            }
        }
    }])
    //定义添加地址
    .controller("newAddrCtrl", ["$scope", "$http", "$routeParams", function ($scope, $http, $routeParams) {
        $scope.msg = "newAddress.html页面";
        $scope.orderid = $routeParams.orderid;
        //console.log($scope.orderid);

        $scope.comment = {};
        $scope.comment.name = ""; //联系人
        $scope.comment.sex = ""; //性别
        $scope.comment.tel = ""; //电话
        $scope.comment.addr = ""; //地址
        $scope.comment.doorplate = ""; //门牌号
        $scope.comment.label = ""; //标签

        if ($scope.orderid.length > 18) {
            $scope.obj = angular.fromJson($routeParams.orderid).obj;
            $scope.comment.name = $scope.obj.name;
            $scope.comment.sex = $scope.obj.sex;
            $scope.comment.tel = $scope.obj.tel;
            $scope.comment.addr = $scope.obj.addr;
            $scope.comment.doorplate = $scope.obj.Doorplate;
            $scope.comment.label = $scope.obj.label;
        }
        $scope.provincesIndex = "";
        $scope.citiesIndex = "--";
        $scope.areasIndex = "--";

        //省
        $scope.getP = function () {
            $http.get("php/getProvinces.php")
                .then(function (response) {
                    $scope.provinces = response.data;
                })
        }
        $scope.getP();
        //市
        $scope.getC = function (a) {
            $http.get("php/getCities.php?index=" + a)
                .then(function (response) {
                    if (response.data.length == 0 && angular.isArray(response.data)) {
                        $scope.cities = null;
                        return;
                    }
                    $scope.cities = response.data;
                    $scope.citiesIndex = $scope.cities[0].city;
                    $scope.getA($scope.citiesIndex);
                })
        }
        $scope.getC();
        //县
        $scope.getA = function (b) {
            $http.get("php/getareas.php?index=" + b)
                .then(function (response) {
                    if (response.data.length == 0 && angular.isArray(response.data)) {
                        $scope.areas = null;
                        return;
                    }
                    $scope.areas = response.data;
                    $scope.areasIndex = $scope.areas[0].area;
                })
        }
        $scope.getA();
        //监听城市的改变
        $scope.$watch("provincesIndex", function () {
            $scope.getC($scope.provincesIndex);
        })
        $scope.$watch("citiesIndex", function () {
            $scope.getA($scope.citiesIndex);
        })
        $scope.addAddrBtn = function () {
            //提交数据、
            var comment = jQuery.param($scope.comment);
            console.log(comment);
            $http.get("php/addr.php?" + comment + "&addr=" + $scope.provincesIndex + $scope.citiesIndex + $scope.areasIndex)
                .then(function (response) {
                    console.log(response.data);
                    alert("传");
                    $scope.jump("/b/" + $scope.orderid);
                }, function (error) {
                    alert("过");
                })
        }
        $scope.Delete = function () {
            if (confirm("是否删除该商品")) {
                alert("删");
                $http.get("php/Delete.php?aid=" + $scope.obj.aid)
                    .then(function (response) {
                        console.log(response.data);
                        $scope.jump('/addr/' + angular.fromJson($routeParams.orderid).upid);
                    })
            }
        }

        $scope.Ensure = function () {
            var Ensure = jQuery.param($scope.comment);
            console.log(Ensure);
            $http.get("php/update.php?" + Ensure + "&dName=" + $scope.obj.name + "&dsex=" + $scope.obj.sex + "&dtel=" + $scope.obj.tel + "&ddoorplate=" + $scope.obj.Doorplate + "&dlabel=" + $scope.obj.label)
                .then(function (response) {
                    console.log(response.data);
                    console.log($scope.provincesIndex + $scope.citiesIndex + $scope.areasIndex);
                    alert("改");
                    $scope.jump('/addr/' + angular.fromJson($routeParams.orderid).upid);
                }, function (error) {
                    console.log(error);
                    alert("过");
                })
        }

    }])
    //定义user_loginCtrl
    .controller("user_loginCtrl", ["$scope", "$http", function ($scope, $http) {
        $scope.msg = "这是user_login.html页面";
        $scope.user = {};
        $scope.user.userName = "";//用户名
        $scope.user.pwd = "";//密码
        $scope.user.regCode = "";//验证码

        //用户名
        $scope.userUser = false;
        $scope.b = function () {
            var reg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
            if (reg.test($scope.user.userName)) {
                $scope.userUser = true;
                $scope.www = "格式正确";
            } else {
                $scope.userUser = false;
                $scope.www = "格式不正确";
            }
        }
        //密码
        $scope.pwd = false;
        $scope.a = function () {
            var pwddwp = /^\w{7,16}$/;
            if (pwddwp.test($scope.user.pwd)) {
                $scope.pwd = true;
                $scope.vvv = "密码格式符号";
            } else {
                $scope.pwd = false;
                $scope.vvv = "密码格式不符合";
            }
        }
        $scope.checkLogin = function (ev) {
            alert("X");
            var ev = ev || window.event;
            //阻止checkLogin按钮默认刷新页面
            ev.preventDefault();
            //判断输入是否合法
            if (!$scope.user.userName) {
                alert("用户不能为空");
                return;
            }
            if (!$scope.user.pwd) {
                alert("密码不能为空");
                return;
            }
            if (!$scope.user.regCode) {
                alert("验证码不能为空");
                return;
            }
            var userData = jQuery.param($scope.user);
            $http.post("php/user_login.php?" + userData)
                .then(function (response) {
                    //console.log(response.data);
                    $scope.user2 = response.data;
                    $scope.user3 = response;
                    if (response.data.reg_insert == "ok") {
                        //登录成功后 执行全局函数getuser()
                        $scope.jump("/m");
                        $scope.getuser();
                        //console.log($scope.user.userName);
                    }
                }, function (error) {
                    alert("失败");
                });
        }
    }])
    //定义user_registerCtrl
    .controller("user_registerCtrl", ["$scope", "$http", function ($scope, $http) {
        $scope.msg = "这是user_register.html页面";
        //定义数据对象，存储所有的注册数据
        $scope.userReg = {};
        $scope.userReg.userName = "";//用户名
        $scope.userReg.userpwd = "";//密码
        $scope.userReg.userPhone = "";//手机号
        $scope.userReg.userRepwd = "";//重复密码验证
        $scope.userReg.userId = "";//验证身份证
        $scope.userReg.usermail = "";//验证邮箱

        //验证用户名
        $scope.regRRR = false;
        $scope.fun = function () {
            var reg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
            if (reg.test($scope.userReg.userName)) {
                $scope.regRRR = true;
                $scope.mmm = "格式正确";
            } else {
                $scope.regRRR = false;
                $scope.mmm = "格式不正确";
            }
        }


        //验证密码
        $scope.pwd = false;
        $scope.pwdfun = function () {
            var pwddwp = /^\w{7,16}$/;
            if (pwddwp.test($scope.userReg.userpwd)) {
                $scope.regpwd = true;
                $scope.bbb = "密码格式符号";
            } else {
                $scope.regpwd = false;
                $scope.bbb = "密码格式不符合";
            }
        }
        //验证重复密码


        //验证电话
        $scope.regRRRR = false;
        $scope.fun1 = function () {
            var phone = /^1[3-9][0-9]{9}$/;
            if (phone.test($scope.userReg.userPhone)) {
                $scope.regRRRR = true;
                $scope.aaa = "该手机号可以注册"
            } else {
                $scope.regRRRR = false;
                $scope.aaa = "手机号格式不正确";
            }
        }

        //验证身份证
        $scope.regid = false;
        $scope.Id = function () {
            var ID = /^[1-8]\d{5}[12][0-9]{3}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9xX]$/;
            if (ID.test($scope.userReg.userId)) {
                $scope.regid = true;
                $scope.id = "该身份证号可以注册"
            } else {
                $scope.regid = false;
                $scope.id = "身份证号格式不正确";
            }
        }

        //验证邮箱
        $scope.regmail = false;
        $scope.yx = function () {
            var yx = /^[a-zA-Z0-9]\w{3,12}@[a-zA-Z0-9]{2}\.[A-Za-z]{2,3}(\.[A-Za-z]{2,3})?$/;
            if (yx.test($scope.userReg.usermail)) {
                $scope.regmail = true;
                $scope.mil = "该邮箱可以注册"
            } else {
                $scope.regmail = false;
                $scope.mil = "邮箱格式不正确";
            }
        }

        $scope.submitReg = function (ev) {
            var ev = ev || window.event;
            //阻止submit按钮默认刷新页面
            ev.preventDefault();
            //先判断数据是否正确,然后在转换数据，提交数据
            if ($scope.regRRR = true && $scope.regpwd == true && $scope.regRRRR == true) {
                alert("a");
                //jquery.param() 直接把对象变成数据提交格式 key=val&key=val
                alert($.param($scope.userReg));
                //var userData = $.param($scope.userReg);
                //var userData1 = jQuery.param($scope.userReg);
                $scope.userData = jQuery.param($scope.userReg);
                console.log($scope.userData);
                //提交数据
                $http.post("php/user_register.php?" + $scope.userData)
                    .then(function (response) {
                        console.log(response.data);
                        $scope.user = response.data;
                        $scope.user1 = response;
                        alert("成功");
                        $scope.jump("/ul");
                    }, function (error) {
                        alert("只许成功，不许失败");
                    })
            }
        }
    }])
    //定义路由 配置路由
    .config(["$routeProvider", function ($routeProvider) {
        $routeProvider
            .when("/s", {//起始页
                templateUrl: "tpl/start.html",
                controller: "startCtrl"
            })
            .when("/m", {//首页面菜单页
                templateUrl: "tpl/main.html",
                controller: "mainCtrl"
            })
            .when("/login", {//登录页
                templateUrl: "tpl/login.html",
                controller: "loginCtrl"
            })
            .when("/ul", {//用户名登录页面
                templateUrl: "tpl/user_login.html",
                controller: "user_loginCtrl"
            })
            .when("/pl", {//手机登录页面
                templateUrl: "tpl/phone_login.html",
                controller: "phone_loginCtrl"
            })
            .when("/sul", {//店铺用户登录页
                templateUrl: "tpl/shopUser_login.html",
                controller: "shopUser_loginCtrl"
            })
            //$routeParams 这是一个路由依赖的一个对象
            .when("/a/:sid", {//详情页
                templateUrl: "tpl/details.html",
                controller: "detailsCtrl"
            })//如何取到路由地址中二级地址 /:aaaa
            .when("/b/:orderid", {//订单页
                templateUrl: "tpl/order.html",
                controller: "orderCtrl"
            })
            .when("/c", {//个人订单页
                templateUrl: "tpl/myOrder.html",
                controller: "myOrderCtrl"
            })
            .when("/d", {//手机注册页
                templateUrl: "tpl/phone_register.html",
                controller: "phone_registerCtrl"
            })
            .when("/e", {//注册页
                templateUrl: "tpl/register.html",
                controller: "registerCtrl"
            })
            .when("/f", {//购物车页面
                templateUrl: "tpl/shopCar.html",
                controller: "shopCarCtrl"
            })
            .when("/g/:shopid", {//购物菜单
                templateUrl: "tpl/shopMain.html",
                controller: "shopMainCtrl"
            })
            .when("/h", {//店铺登录页
                templateUrl: "tpl/shopUser_login.html",
                controller: "shopUser_loginCtrl"
            })
            .when("/j", {//店铺注册页
                templateUrl: "tpl/shopUser_register.html",
                controller: "shopUser_registerCtrl"
            })
            .when("/k", {//用户注册页面
                templateUrl: "tpl/user_register.html",
                controller: "user_registerCtrl"
            })
            .when("/kw", {//用户注册页面
                templateUrl: "tpl/kw.html",
                controller: "kwCtrl"
            })
            .when("/addr/:orderid", {//地址页面
                templateUrl: "tpl/addr.html",
                controller: "addrCtrl"
            })
            .when("/newAddr/:orderid", {//地址页面
                templateUrl: "tpl/newAddress.html",
                controller: "newAddrCtrl"
            })
            .when("/pay/:orderid", {//支付页面
                templateUrl: "tpl/pay.html",
                controller: "payCtrl"
            })
            .when("/house", {//支付页面
                templateUrl: "tpl/house.html",
                controller: "houseCtrl"
            })
            .when("/zfb/:orderid", {//支付宝页面
                templateUrl: "tpl/zfb.html",
                controller: "zfbCtrl"
            })
            .when("/wx/:orderid", {//微信支付页面
                templateUrl: "tpl/wx.html",
                controller: "wxCtrl"
            })
            .when("/noPay/:orderid", {//微信支付页面
                templateUrl: "tpl/noPay.html",
                controller: "noPayCtrl"
            })
            .when("/waitPay/:orderid", {//等待支付页面
                templateUrl: "tpl/waitPay.html",
                controller: "waitPayCtrl"
            })
            .when("/yyy/:orderid", {//等待支付页面
                templateUrl: "tpl/yyy.html",
                controller: "yyyCtrl"
            })
            .otherwise({//当访问的路由不是上述配置的路由时，重定向位置
                redirectTo: "/m"//重定向页面路由位置
            })
    }])