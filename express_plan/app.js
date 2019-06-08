require('./db');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const TodoModel = mongoose.model('planData');
const URL = require('url');
const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

// 设置允许跨域访问
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

/* 计划页start */
//获取主页计划列表项,将计划存入数据库
app.post('/MPlist', function (req, res) {
    const plan_list = req.body.data;
    TodoModel.find().then(result => {
        if (result.length === 0) {
            new TodoModel({
                plan_list: plan_list
            }).save(function (err, todo, count) {
                // console.log("内容", todo, "数量", count);
            });
        } else {
            TodoModel.updateOne({
                _id: result[0]._id
            }, {
                $push: {
                    plan_list: {
                        $each: plan_list
                    }
                }
            }, (err) => {
                if (err) {
                    console.log(err);
                }
            })
        }
    });
    res.send(req.body.data);
});

// 获取数据库计划列表,将数据传到前台
app.get('/getPlanList', function (req, res) {
    TodoModel.find({
        _id: '5ca1afe84a5d332ed899f1f9'
    }).then(result => {
        // console.log('result:' + result);
        res.send(result);
    });
})

// 删除数据库的对应计划项
app.post('/delList', function (req, res) {
    const del = req.body.data;//前端传过来的需要删除的计划内容
    TodoModel.updateOne({
        _id: '5ca1afe84a5d332ed899f1f9'
    }, {
        $pull: {
            plan_list: del
        }
    }, (err) => {
        if (err) {
            console.log(err);
        }
    });
    res.send(req.body.data);
});

//获取主页百分数 更新数据库百分数
app.post('/upPercent', function (req, res) {
    // console.log(req.body.data);
    var percent = req.body.data;
    TodoModel.find().then(result => {
        // console.log(result[0]._id);
        if (result.length === 0) {
            new TodoModel({
                percent: percent
            }).save(function (err, todo, count) {
                // console.log("内容", todo, "数量", count);
            });
        } else {
            TodoModel.updateOne({
                _id: result[0]._id
            }, {
                percent: percent
            }, (err) => {
                if (err) {
                    console.log(err);
                }
            })
        }
    });
    const per = req.body.data.toString();
    res.send(per);
});
/* 计划页end */



/* 成就页start */
//获取百分数和计划项目数
app.get('/getPerandlist', function (req, res) {
    TodoModel.find({
        _id: '5ca1afe84a5d332ed899f1f9'
    }).then(result => {
        // console.log('result:' + result);
        res.send(result);
    });
});

//将日期百分数颜色上传到数据库
app.post('/storage', function (req, res) {
    const achi_date = req.body.achiDate;
    const achi_percent = req.body.achiPercent;
    const achi_color = req.body.achiColor;
    // console.log(achi_date);
    TodoModel.find().then(result => {
        // console.log(result[0]._id);
        if (result.length === 0) {
            new TodoModel({
                achi: {
                    achi_date: achi_date,
                    achi_percent: achi_percent,
                    achi_color: achi_color
                }
            }).save(function (err, todo, count) {
                // console.log("内容", todo, "数量", count);
            });
        } else {
            //如果数据库里有当天日期的相关数据，就更新
            TodoModel.updateOne({
                // _id: result[0]._id
                _id: '5ca1afe84a5d332ed899f1f9'
            }, {
                $push: {
                    achi: {
                        achi_date: achi_date,
                        achi_percent: achi_percent,
                        achi_color: achi_color
                    }
                }
                /* $pull: {
                    achi: {
                        achi_date: '2019/04/15'
                    }
                } */
            }, (err) => {
                if (err) {
                    console.log(err);
                }
            })
        }
    });
    res.send(achi_color);
});

//将数据库成就页数据发送到前台
app.get('/getAchi', function (req, res) {
    TodoModel.find({
        _id: '5ca1afe84a5d332ed899f1f9'
    }).then(result => {
        // console.log('result:' + result);
        res.send(result);
    });
});
/* 成就页end */



/* 日志页start */
//获取日志相关数据 保存到数据库
app.post('/addRecord', function (req, res) {
    var log_title = req.body.logTitle;
    var log_content = req.body.logContent;
    var log_time = req.body.logTime;
    var log_img = req.body.logImg;
    var log_num = req.body.logNum;
    // console.log(log_title, log_content, log_time);
    TodoModel.find().then(result => {
        // console.log(result[0]._id);
        if (result.length === 0) {
            new TodoModel({
                notePad: {
                    log_title: log_title,
                    log_content: log_content,
                    log_time: log_time,
                    log_img: log_img,
                    log_num: log_num
                }
            }).save(function (err, todo, count) {
                // console.log("内容", todo, "数量", count);
            });
        } else {
            TodoModel.updateOne({
                _id: result[0]._id
            }, {
                $push: {
                    notePad: {
                        log_title: log_title,
                        log_content: log_content,
                        log_time: log_time,
                        log_img: log_img,
                        log_num: log_num
                    }
                }
            }, (err) => {
                if (err) {
                    console.log(err);
                }
            })
        }
    });
})

//获取数据库日志数据 发送到前台
app.get('/getRecordList', function (req, res) {
    TodoModel.find({
        _id: '5ca1afe84a5d332ed899f1f9'
    }).then(result => {
        // console.log('result:' + result);
        res.send(result);
    });
});

//删除数据库日志项目
app.post('/delRecord', function (req, res) {
    const del = req.body.data;
    // console.log(del);
    TodoModel.updateOne({
        _id: '5ca1afe84a5d332ed899f1f9'
    }, {
        $pull: {
            notePad: {
                log_num: del
            }
        }
    }, (err) => {
        if (err) {
            console.log(err);
        }
    });
    res.send(req.body.data);
});
/* 日志页end */

app.listen(3000, () => console.log('Example app listening on port 3000!'))