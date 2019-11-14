require('./db');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const TodoModel = mongoose.model('planData');
const path = require('path');
const URL = require('url');
const app = express();

app.use(express.static(path.join(__dirname, '../', 'jQuery_plan')));

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

/* 登录页start */
/* 注册 */
app.post('/newUser', function (req, res) {
    const newName = req.body.userName;
    const newpwd = req.body.userpwd;
    TodoModel.find().then(result => {
        if (result.length === 0) {
            new TodoModel({
                userName: newName,
                userpwd: newpwd
            }).save(function (err, todo, count) {
                // console.log("内容", todo, "数量", count);
            });
            res.send({
                message: '注册成功',
                name: newName
            });
        } else {
            for (var i = 0; i < result.length; i++) {
                if (result[i].userName == newName) {
                    res.send('用户名已被使用');
                    return false;
                }
            }
            new TodoModel({
                userName: newName,
                userpwd: newpwd
            }).save(function (err, todo, count) {
                // console.log("内容", todo, "数量", count);
            });
            res.send({
                message: '注册成功',
                name: newName
            });
        }
    })
})

/* 登录 */
app.post('/user', function (req, res) {
    const name = req.body.name;
    const password = req.body.password;
    TodoModel.find({
        userName: name
    }).then(result => {
        if(result.length == 0){
            res.send({message: '用户名不存在'});
        }else {
            if(result[0].userpwd == password){
                res.send({
                    message: '登录成功',
                    name: name
                });
                return false;
            }else {
                res.send({message: '密码错误'})
            }
        }
    }).catch(err => {
        console.log(err);
    })
})

/* 注销 */
app.post('/delUser', function (req, res) {
    const name = req.body.name;
    const password = req.body.password;
    TodoModel.find({
        userName: name
    }).then(result => {
        if(result.length == 0){
            res.send('用户名不存在');
        }else {
            if(result[0].userpwd == password){
                TodoModel.remove({
                    userName: name
                }, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
                res.send('注销成功')
            }else {
                res.send('密码错误')
            }
        }
    }).catch(err => {
        console.log(err);
    })
})
/* 登录页end */

/* 计划页start */
//获取主页计划列表项,将计划存入数据库
app.post('/MPlist', function (req, res) {
    const findName = req.body.userName;
    const plan_list = req.body.planList;
    console.log(plan_list)
    TodoModel.updateOne({
        userName: findName
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
    res.send(plan_list);
});

// 获取数据库计划列表,将数据传到前台
app.post('/getPlanList', function (req, res) {
    const findName = req.body.userName;
    TodoModel.find({
        userName: findName
    }).then(result => {
        res.send(result[0].plan_list);
    });
})

// 删除数据库的对应计划项
app.post('/delList', function (req, res) {
    const findName = req.body.userName;
    const del = req.body.data; //前端传过来的需要删除的计划内容
    TodoModel.updateOne({
        userName: findName
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
    const percent = req.body.percent;
    const findName = req.body.userName;
    TodoModel.find({
        userName: findName
    }).then(result => {
        // console.log(result[0]._id);
        if (result.length === 0) {
            new TodoModel({
                percent: percent
            }).save(function (err, todo, count) {
                // console.log("内容", todo, "数量", count);
            });
        } else {
            TodoModel.updateOne({
                // _id: result[0]._id
                userName: findName
            }, {
                percent: percent
            }, (err) => {
                if (err) {
                    console.log(err);
                }
            })
        }
    });
    const per = req.body.percent.toString();
    res.send(per);
});
/* 计划页end */



/* 成就页start */
//获取百分数和计划项目数
app.post('/getPerandlist', function (req, res) {
    const findName = req.body.userName;
    TodoModel.find({
        userName: findName
    }).then(result => {
        // console.log('result:' + result[0].percent, result[0].plan_list.length);
        res.send({
            percent: result[0].percent,
            listNum: result[0].plan_list.length
        });
    });
});

//将日期百分数颜色上传到数据库
app.post('/storage', function (req, res) {
    const findName = req.body.userName;
    const achi_date = req.body.achiDate;
    const achi_percent = req.body.achiPercent;
    const achi_color = req.body.achiColor;
    //更新数据库里当天日期的相关数据
    TodoModel.updateOne({
        userName: findName
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
    res.send(achi_color);
});

//将数据库成就页数据发送到前台
app.post('/getAchi', function (req, res) {
    const findName = req.body.userName;
    TodoModel.find({
        userName: findName
    }).then(result => {
        // console.log('result:' + result[0].achi);
        res.send(result[0].achi);
    });
});
/* 成就页end */



/* 日志页start */
//获取日志相关数据 保存到数据库
app.post('/addRecord', function (req, res) {
    const findName = req.body.userName;
    const log_title = req.body.logTitle;
    const log_content = req.body.logContent;
    const log_time = req.body.logTime;
    const log_img = req.body.logImg;
    const log_num = req.body.logNum;
    // console.log(log_title, log_content, log_time);
    TodoModel.updateOne({
        userName: findName
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
})

//获取数据库日志数据 发送到前台
app.post('/getRecordList', function (req, res) {
    const findName = req.body.userName;
    TodoModel.find({
        userName: findName
    }).then(result => {
        // console.log('result:' + result[0].notePad);
        res.send(result[0].notePad);
    });
});

//删除数据库日志项目
app.post('/delRecord', function (req, res) {
    const findName = req.body.userName;
    const del = req.body.data;
    // console.log(del);
    TodoModel.updateOne({
        userName: findName
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