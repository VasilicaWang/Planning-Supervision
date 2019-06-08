$(function () {
    /**
     * 1、点击添加日志：编辑日志的页面出现---------完成
     * 2、日志的时间 自动获取当前时间 就是点击保存后的时间---------完成
     * 3、编辑页面：点击保存，将标题保存到首页的h5标签中---------完成
     *             点击取消，关闭编辑页面---------完成
     *            （如果标题为空或者内容为空，保存键不能点击）---------完成
     *             点击保存将数据传入数据库---------完成
     * 4、点击查看 查看日志---------完成
     * 5、点击删除 删除该条日志---------完成
     * 6、获取数据库日志数据添加到日志主界面---------完成
     * 7、上传图片---------完成
     * 8、查看图片---------完成
     * 
     */

    // 获取数据库日志列表 添加到主页
    axios.get("http://localhost:3000/getRecordList").then(res => {
        var RecordList = res.data[0].notePad;
        for (var i = 0; i < RecordList.length; i++) {
            var title = RecordList[i].log_title;
            var content = RecordList[i].log_content;
            var time = RecordList[i].log_time;
            var img = RecordList[i].log_img;
            var recordNum = RecordList[i].log_num;
            var str = '';
            for (var j = 0; j < img.length; j++) {
                str += '<img src=' + img[j] + '>';
            };
            var editJournalLi = '<li class="journal_list">' +
                '<div class="li_header">' +
                '<h5>' + title + '</h5>' +
                '<span>' + time + '</span>' +
                '</div>' +
                '<div class="li_content" style="display: none">' + content + '</div>' +
                '<div class="li_id" style="display: none">' + recordNum + '</div>' +
                '<div class="edit">' +
                '<input type="button" class="view" value="查看">' +
                '<input type="button" class="delete" value="删除">' +
                '</div>' +
                '<div class="imgResult" style="display: none">' + str + '</div>' +
                '</li>';
            $(".journal").prepend(editJournalLi);
        }
    });

    // 点击添加日志 编辑日志的页面出现
    $(".add_record").on("click", function () {
        $(".make_record").show();
        // $('.textarea').removeAttr("disable");

    });

    // 编辑日志标题
    $(".content_title input").on("blur focus", function () {
        //判断是否获取焦点
        if ($(this).is(":focus")) {
            //把输入框里面的文字颜色变为白色
            $(this).css("color", "#fff");
            //如果之前的内容是默认值，那么清空
            if ($(this).val() == "编辑标题") {
                $(this).val("");
            }
        } else { //失去焦点
            //判断内容是空的或默认值
            if ($(this).val() == "" || $(this).val() == "编辑标题") {
                $(this).val("编辑标题");
                $(this).css("color", "#ffffffb4");
            } else {
                $(this).css("color", "#fff");
            }
        }
    });

    // 限制日志文本框输入字数
    $(".textarea").keyup(function () {
        var _html = $(this).text();
        if (_html.trim().length > 500) {
            $(this).blur();
            alert("感想太多了框框吃不消了~")
        }
    });


    // 上传图片
    $("#chooseImage").on("change", function () {
        //获取到input的value，里面是文件的路径
        var filePath = $(this).val(),//图片具体路径
            fileFormat = filePath.substring(filePath.lastIndexOf(".")).toLowerCase();
        var imgName = (filePath.split('\\'))[filePath.split('\\').length - 1];//图片的名称
        // 检查是否是png、jpg、jpeg格式的图片
        if (!fileFormat.match(/.png|.jpg|.jpeg/)) {
            error_prompt_alert("上传错误,文件格式必须为：png/jpg/jpeg");
            return;
        }
        // 将图片添加到result中，其中result是上传后暂存图片的标签类名
        $(".content_footer .result").append("<img src=file:///D:/acabz/images/" + imgName + ">");
        var resultImg = $(".content_footer .result").find("img");//获取result中的所有图片
        for (let i = 0; i < resultImg.length; i++) {//遍历图片
            //点击图片弹出是否删除框
            $(resultImg[i]).on("click", function () {
                $(this).attr("id", "delImg");//为点击的图片添加一个便于与其他图片区分的id属性
                $(".sureToDel").show();//弹出确认删除框
                $(".sureToDel").on("click", "#STDyes", function () {//确认删除
                    $(".sureToDel").hide();//隐藏弹出框
                    $("#delImg").remove();//删除对应图片
                });
                $(".sureToDel").on("click", "#STDno", function () {//取消删除
                    $(".sureToDel").hide();//隐藏弹出框
                    $("#delImg").removeAttr("id", "delImg");//删除本张图片的id属性
                });
            })
        }
    })

    // 点击保存按钮将编辑好的日志保存到主界面
    $(".MR_save").on("click", "#MR_save", function () {
        // 获取日志标题添加到主界面的日志标题上
        var recordTitle = $(".content_title input").val();
        if ($(".content_title input").val() == "编辑标题") {
            // 如果标题为空或是默认提示字符的话，判断日志内容是否为空
            if ($.trim($(".textarea").text())) {
                // 如果不是空的话
                recordTitle = $(".textarea").text().substr(0, 10) + "......";
            } else if ($(".result img").length) {
                recordTitle = "纯图片日志";
            } else {
                return false;
            }
        }

        // 获取日志内容
        var recordContent = $(".textarea").text();

        // 获取图片地址
        var recordImg = [];
        $(".result img").each(function () {
            recordImg.push($(this).attr("src"));
        });

        // 获取当前时间添加到主界面的时间处
        var nowDate = new Date();
        var nowHour = nowDate.getHours(),
            nowMinute = nowDate.getMinutes();
        var nowYear = nowDate.getFullYear(),
            nowMonth = ("0" + (nowDate.getMonth() + 1)).slice(-2),
            nowDay = ("0" + (nowDate.getDate())).slice(-2);
        var recordTime = nowYear + "/" + nowMonth + "/" + nowDay + " " + nowHour + ":" + nowMinute;

        var recordNum = Date.now();
        recordNum = recordNum.toString();

        // 将标题、内容、时间 添加到数据库
        axios.post("http://localhost:3000/addRecord", {
            logTitle: recordTitle,
            logContent: recordContent,
            logTime: recordTime,
            logImg: recordImg,
            logNum: recordNum //毫秒数是唯一的
        }).then(res => {
            // console.log("ok");
        }).catch(err => {
            console.log(err);
        });

        // 如果没有标题且没有内容的话就不添加
        if ($(".content_title input").val() != "编辑标题" || $(".textarea").text() || $(".result img").length) {
            // 添加主界面单条日志样式
            var str = '';
            for (var i = 0; i < recordImg.length; i++) {
                str += "<img src=" + recordImg[i] + ">";
            }
            var editJournalLi = '<li class="journal_list">' +
                '<div class="li_header">' +
                '<h5>' + recordTitle + '</h5>' +
                '<span>' + recordTime + '</span>' +
                '</div>' +
                '<div class="li_content" style="display: none">' + recordContent + '</div>' +
                '<div class="li_id" style="display: none">' + recordNum + '</div>' +
                '<div class="edit">' +
                '<input type="button" class="view" value="查看">' +
                '<input type="button" class="delete" value="删除">' +
                '</div>' +
                '<div class="imgResult" style="display: none">' + str + '</div>' +
                '</li>';
            $(".journal").prepend(editJournalLi);
            // 清空编辑日志界面的内容
            $(".content_title input").val("编辑标题").css("color", "#ffffffb4");
            $(".textarea").text("");
            $(".result").html("");
            $(".make_record").hide();
            return false;
        } else {
            return false;
        }
    });

    // 点击取消按钮 关闭编辑页面
    $("#MR_nosave").on("click", function () {
        $(".make_record").hide();
    });

    // 日志列表中点击查看 查看日志
    $(".journal").on("click", ".view", function () {
        $(".view_record").show();
        var recordTitle = $(this).parent().parent().find("h5").text();
        var recordTime = $(this).parent().parent().find("span").text();
        var recordContent = $(this).parent().parent().find(".li_content").text();
        $(".view_record h3").text(recordTitle);
        $(".view_record span").text(recordTime);
        if (recordContent) {
            $(".view_record .view_content").text(recordContent);
        } else {
            $(".view_record .view_content").text("这篇日志没有编辑内容o~");
        }
        var str = $(this).parent().parent().find(".imgResult").html();
        $(".view_img").html(str);
    });
    $(".view_record i").on("click", function () {
        $(this).parent().hide();
        $(this).parent().find("h3").text("");
        $(this).parent().find("span").text("");
        $(this).parent().find(".view_conntent").text("");
        $(this).parent().find(".view_img").html("");
    });

    // 点击删除按钮 删除该条日志
    $(".journal").on("click", ".journal_list .delete", function () {
        // 是否确认删除
        $(this).parent().parent().attr("id", "delRecord");
        var recordNum = $("#delRecord").find($(".li_id")).text();
        // console.log(recordNum);
        $(".sureToDel").show();
        $(".sureToDel").on("click", "#STDyes", function () {
            $(".sureToDel").hide();

            // 请求数据库日志数据，删除对应日志
            axios.post("http://localhost:3000/delRecord", {
                data: recordNum
            }).then(res => {
                // console.log(res.data);
            });
            $("#delRecord").remove();
        });
        $(".sureToDel").on("click", "#STDno", function () {
            $(".sureToDel").hide();
            $("#delRecord").removeAttr("id", "delRecord");
            recordNum = "";
        });
    });
})