var mongoose = require("mongoose"); //引入mongoose
mongoose.connect('mongodb://127.0.0.1/planData', {
    useNewUrlParser: true
}); //连接到mongoDB数据库
//该地址格式：mongodb://[username:password@]host:port/database[?options]
//默认port为27017  

var db = mongoose.connection;
db.on('error', function callback() { //监听是否有异常
    console.log("Connection error");
});
db.once('open', function callback() { //监听一次打开
    //在这里创建你的模式和模型
    console.log('connected!');
});

var planSchema = new mongoose.Schema({
    plan_list: Array, //定义一个属性plan_list， 类型为Array
    percent: {type: Number, default: 0},
    achi: [{
        achi_date: String,
        achi_percent: Number,
        achi_color: String
    }],
    notePad: [{
        log_title: String,
        log_content: String,
        log_time: String,
        log_img: Array,
        log_num: String
    }]
});

mongoose.model('planData', planSchema); //将该Schema发布为Model

module.exports = mongoose;