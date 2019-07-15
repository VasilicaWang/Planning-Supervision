$(function () {
    /**
     * 1、点击对勾该条计划消失，也就是完成该条计划-------完成
     * 2、点击add_plan添加计划，出现添加计划页面，设置计划-------完成
     *    点击保存关闭并将所有计划条添加到主页-------完成
     *    向后台提交用户输入的计划列表-------完成
     *    点击取消关闭-------完成
     * 3、点击make_plan的MP_add打开编辑计划条-------完成
     *    点击提交将计划添加--------完成
     *    点击取消关闭编辑计划-------完成
     * 4、完成度process里面的百分数：
     *    在完成某一条计划后点击对勾时获取计划li个数-------完成
     *    根据计划个数分段，计算百分比-------完成
     *    向后台提交百分数-------完成
     *    process下面的温馨小提示-------完成
     */

    // 获取数据库计划列表，添加到主页
    axios.post("http://localhost:3000/getPlanList", {
        userName: $('#userName').text()
    }).then(res => {
        var MPlist = res.data;
        for (var i = 0; i < MPlist.length; i++) {
            var addPlanLi = '<li><span>' + MPlist[i] + '</span><strong>√</strong></li>';
            $(".XS_plan .plan_list").append(addPlanLi);
        }
        // console.log(MPlist);
    });

    //在零点将数据库百分数置为0
    setInterval(function () {
        var nowDate = new Date();
        var nowHour = nowDate.getHours(),
            nowMinute = nowDate.getMinutes();
        var x = 0;
        if (nowHour === 00 && nowMinute === 00) {
            axios.post('http://localhost:3000/upPercent', {
                percent: x,
                userName: $('#userName').text()
            }).then(res => {
                var x = res.data;
                $(".process b").text("革命计划尚未成熟！");
                x = x + "%";
                $(".process .percent p").text(x);
            }).catch(err => {
                console.log(err);
            });
        }
    }, 1000);

    // 点击add_plan，出现制定计划的屏罩，开始指定计划
    $(".add_plan").click(function () {
        $(".MP_list").find("li").remove();
        $(".make_plan").show();
        var MPlist = [];
        $(".plan_list").find("li").find("span").each(function () {
            MPlist.push($(this).text());
        });
        for (var i = 0; i < MPlist.length; i++) {
            var addPlanLi = '<li><span>' + MPlist[i] + '</span><input type="button" value="×"></li>';
            $(".MP_list").append(addPlanLi);
        };
    });

    // 主页 √ 点击事件
    $(".plan_list").on("click", "strong", function () {
        // 隐藏该条计划
        $(this).parent().hide();

        // 在这里获取 li 的个数，然后计算process里的百分比
        var i = $(this).parent().parent().find("li").length;
        $(this).parent().parent().find("li").each(function () {
            if ($(this).css("display") != "none") {
                i--;
            }
        });
        var x = (i / $(this).parent().parent().find("li").length) * 100;
        // 向后端提交更新百分数
        axios.post('http://localhost:3000/upPercent', {
            percent: x,
            userName: $('#userName').text()
        }).then(res => {
            var x = res.data;
            // process下面的小提示
            if (x < 25) {
                $(".process b").text("革命计划尚未成熟！");
                x = x.toFixed(1) + "%";
            } else if (x < 50) {
                $(".process b").text("革命还需努力！");
                x = x.toFixed(1) + "%";
            } else if (x < 75) {
                $(".process b").text("还有任务没有完成哦！");
                x = x.toFixed(1) + "%";
            } else if (x < 100) {
                $(".process b").text("加油加油！冲刺！");
                x = x.toFixed(1) + "%";
            } else {
                $(".process b").text("恭喜完成了所有任务！");
                x = x + "%";
            }
            $(".process .percent p").text(x);
        }).catch(err => {
            console.log(err);
        });
    });

    // 点击make_plan的MP_add添加计划，出现屏罩，编辑计划
    $(".make_plan .MP_add").click(function () {
        $(".edit_plan").show();
    });

    // 点击提交按钮提交，并将数据传入编辑计划的列表
    $("#submit").click(function () {
        if ($(".edit_plan textarea").val()) {
            var editPlanLi = '<li><span>' + $(".edit_plan textarea").val() + '</span><input type="button" value="×"></li>';
            $(".MP_list").append(editPlanLi);
            $(".edit_plan textarea").val("");
            $(".edit_plan").hide();
            return false;
        } else {
            return false;
        }
    });

    //计划页点击删除计划
    $(".MP_list").on("click", "input", function () { // 点击×号，删除对应列
        $(this).parent().remove(); // 删除编辑计划页面对应列
        var delList = $(this).parent().find('span').text(); //删除的计划的具体内容
        $("#nosave").on("click", function () { //取消删除
            return false
        });
        $("#save").on("click", function () { //确认删除
            // 删除数据库相应列表项
            axios.post("http://localhost:3000/delList", {
                data: delList,
                userName: $('#userName').text()
            }).then(res => { //删除计划主页对应计划
                $(".plan_list").find("li").find('span:contains("' + res.data + '")').parent().remove();
            });
        })
    });

    // 点击取消按钮，关闭编辑计划文本框
    $("#cancel").click(function () {
        $(".edit_plan").hide();
    });

    // 点击保存按钮，保存计划列表
    $("#save").on("click", function () {
        if ($(".MP_list").find("li").length != 0) {
            // 编辑页面的字符串数组
            var MPlist = [];
            $(".MP_list").find("li").find("span").each(function () {
                MPlist.push($(this).text());
            });

            // 先MP_list自身去重
            var newMPlist = [];
            for (var i = 0; i < MPlist.length; i++) {
                if (newMPlist.indexOf(MPlist[i]) == -1) {
                    newMPlist.push(MPlist[i]);
                }
            }

            // 主页字符串数组
            var planList = [];
            $(".plan_list").find("li").find("span").each(function () {
                planList.push($(this).text());
            });

            // 再跟首页计划对比去重
            for (var i = 0; i < planList.length; i++) {
                for (var j = 0; j < newMPlist.length; j++) {
                    if (newMPlist[j] == planList[i]) {
                        newMPlist.splice(j, 1);
                    }
                }
            }

            // 关闭制定计划页
            $(".make_plan").hide();

            // 向后端提交用户计划数据
            axios.post('http://localhost:3000/MPlist', {
                planList: newMPlist,
                userName: $('#userName').text()
            }).then(res => {
                // 将制定计划页里的计划列添加到首页的计划表里
                for (var i = 0; i < res.data.length; i++) {
                    var addPlanLi = '<li><span>' + res.data[i] + '</span><strong>√</strong></li>';
                    $(".XS_plan .plan_list").append(addPlanLi);
                }
            }).catch(err => {
                console.log(err);
            });
        } else {
            return false;
        }
        $(".MP_list").find("li").remove();
    });

    // 点击取消保存关闭制定计划页
    $("#nosave").click(function () {
        $(".make_plan").hide();
    });
})