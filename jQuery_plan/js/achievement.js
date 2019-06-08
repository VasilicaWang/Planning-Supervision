$(function () {
    /**
     * 1、编辑日历表 ---------- 完成
     * 2、在零点获取计划列表项书节目 ----------完成
     *    在零点获取计划页百分数 ----------完成
     *    根据项目数和百分数分颜色块 ---------- 完成
     * 3、动态添加当天的背景颜色 ---------- 完成
     * 4、将当天的日期、百分数、背景色上传到数据库 ---------- 完成
     * 
     */


    // 今天的年、月、日 本月的总天数 本月第一天是周几
    var iNow = 0;

    function run(n) {
        var oDate = new Date(); //定义时间
        oDate.setMonth(oDate.getMonth() + n); //设置月份
        var year = oDate.getFullYear(); //年
        var month = oDate.getMonth(); //月
        var today = oDate.getDate(); //日

        // 计算本月有多少天
        var allDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        // 判断闰年
        if (month == 1) {
            if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
                allDay = 29;
            }
        }

        // 判断本月第一天是星期几
        // 时间调整到本月第一天
        oDate.setDate(1);
        // 读取本月第一天是星期几
        var week = oDate.getDay();
        // 每次清空
        $(".dateList").empty();

        // 插入空白
        for (var i = 0; i < week; i++) {
            $(".dateList").append("<li></li>");
        }

        // 日期插入到dateList
        for (var i = 1; i <= allDay; i++) {
            var str = '<li>' +
                '<span>' + i + '</span>' +
                '<div class="time" style="display: none">' +
                (year + '/' + (("0" + (month + 1)).slice(-2)) + "/" + (("0" + i).slice(-2))) +
                '</div>' +
                '</li>';
            $(".dateList").append(str);
        }

        // 标记颜色
        $(".dateList li").each(function (i, elm) {
                var val = $(this).find("span").text();
                // 隐藏没有当前月份日期的li
                if (val == "") {
                    $(this).css("visibility", "hidden");
                }
                if (n == 0) {                    
                    if (val == today) {
                        $(this).css("color", "green");
                        var todayYear = year,
                            todayMonth = ("0" + (month + 1)).slice(-2),
                            todayDay = ("0" + today).slice(-2);
                        var todayDate = todayYear + '/' + todayMonth + '/' + todayDay;
                        $(this).find(".time").text(todayDate);

                        var time = setInterval(function () {
                            var nowDate = new Date();
                            var nowHour = nowDate.getHours(),
                                nowMinute = nowDate.getMinutes(),
                                nowSecond = nowDate.getSeconds();
                            var nowYear = nowDate.getFullYear(),
                                nowMonth = ("0" + (nowDate.getMonth() + 1)).slice(-2),
                                nowDay = ("0" + (nowDate.getDate())).slice(-2);
                            if (nowYear == todayYear && nowMonth == todayMonth && nowDay == todayDay && nowHour == 0 && nowMinute == 0 && nowSecond == 0) {
                                console.log("ok");
                                // 获取数据库百分数以及计划项目数
                                axios.get("http://localhost:3000/getPerandlist").then(res => {
                                    var percent = res.data[0].percent;//percent：获取到的百分数
                                    var listNum = res.data[0].plan_list.length;//listNum：获取到计划数目
                                    var step = 255 / listNum;//step：颜色跨度
                                    //colorRGB：根据百分数、计划数、跨度计算对应的背景色
                                    var colorRGB = (step * (percent / 100) * listNum);
                                    //color：背景颜色的RGB值
                                    var color = "rgb(255," + (255 - colorRGB) + "," + (255 - colorRGB) + ")";
                                    axios.post("http://localhost:3000/storage", {//存储今天的日期、对应的百分数和背景颜色
                                        achiDate: todayDate,
                                        achiPercent: percent,
                                        achiColor: color
                                    }).then(res => {
                                        $(this).css("backgroundColor", res.data);//将背景色添加到今天的日期上
                                    })
                                });
                            }
                        }, 1000);
                    }
/*                     if (val == today + 16) {
                        $(this).css('color',"#fff")
                        var todayYear = year,
                            todayMonth = ("0" + (month + 1)).slice(-2),
                            todayDay = ("0" + (today+16)).slice(-2);
                        var todayDate = todayYear + '/' + todayMonth + '/' + todayDay;
                        $(this).find(".time").text(todayDate);
    
                        console.log("ok");
                        // 获取数据库百分数以及计划项目数
                        axios.get("http://localhost:3000/getPerandlist").then(res => {
                            var percent = res.data[0].percent;
                            var listNum = res.data[0].plan_list.length;
                            var step = 255 / listNum;
                            var colorRGB = (step * (percent / 100) * listNum);
                            var color = "rgb(255," + (255 - colorRGB) + "," + (255 - colorRGB) + ")";
                            axios.post("http://localhost:3000/storage", {
                                achiDate: todayDate,
                                achiPercent: percent,
                                achiColor: color
                            }).then(res => {
                                $(this).css("backgroundColor", res.data);
                            })
                        });
                    } */
                }
            if (i % 7 == 0 || i % 7 == 6) {
                $(this).addClass("sun");
            }
        });

    // 定义标题日期
    $("#calendar h4").text(year + "年" + (month + 1) + "月");

    // 获取数据库成就页相关数据添加到成就界面
    axios.get("http://localhost:3000/getAchi").then(res => {
        var achi = res.data[0].achi;
        for (var i = 0; i < achi.length; i++) {
            var date = achi[i].achi_date,
                color = achi[i].achi_color;
            $(".dateList").find("li").find('.time:contains("' + date + '")').parent().css("background", color);
        }
    })
}; run(0);

// 点击上月
$(".a1").click(function () {
    iNow--;
    run(iNow);
});

// 点击下月
$(".a2").click(function () {
    iNow++;
    run(iNow);
});

// 底部日期颜色说明
function colorMean() {
    var colorNum = $(".colorMean").find("li").length;
    var step = 255 / colorNum;
    var i = 0;
    $(".colorMean .ul").find("li").each(function () {
        $(this).css("backgroundColor", "rgb(255," + (255 - step * i) + "," + (255 - step * i) + ")");
        i++;
    })
}
colorMean();
})