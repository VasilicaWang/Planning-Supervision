## 计划监督项目包含了制定计划页、成就页、日志页。
- 总的gif动图
 + ![注册登录总动图](https://github.com/VasilicaWang/Planning-Supervision/blob/master/new.gif) <br>

- 计划页是用户制定的计划列表，用户手动输入每条计划，并将计划保存到计划页面，<br>
        + 每当用户完成了一条计划，就可以将该条计划隐藏，项目会根据用户的完成情况自动计算百分数，<br>
        + 当用户需要更改计划时，也可以在制定计划页面对计划进行调整，删除或者是增加计划；<br>
        ![计划页动图](https://github.com/VasilicaWang/Planning-Supervision/blob/master/1-plan.gif) <br>
- 成就页由一个日历组成，该日历上显示的是用户的每日计划完成情况，<br>
        + 系统会自动获取用户的计划条数并为用户计算颜色块的跨度，根据计划页的百分数找出相应的颜色块并添加到日历上，<br>
        + 这样，用户可以在成就页面上查看自己开始执行计划后，过去的每天的计划完成情况，<br>
        + 如果完成情况较好，计划页的颜色跨度会比较小，用户也会获取极大的满足感；<br>
        ![成就页图片](https://github.com/VasilicaWang/Planning-Supervision/blob/master/3-achievement.PNG) <br>
- 日志页的作用主要是用户用于记录自己的心得体会，每天的感想或者是经历，<br>
        + 每条日志的排列主要是根据日期进行排序，<br>
        + 用户可以查看自己写过的日志，回忆自己从制定计划开始后的经历和体会；<br>
        + 用户在编辑日志的同时也可以上传图片，<br>
        + 比如说一张代表心情的图片、今天背单词时的学习图片、或者是今天去健身后拍下的图片，<br>
        + 图片会以小图的形式进行上传，而用户在查看自己的日志时是以大图的形式进行展示。<br>
        ![日志页动图](https://github.com/VasilicaWang/Planning-Supervision/blob/master/2-notepad.gif) 

## 本设计项目，实现了如下功能：

- 编辑计划：制定计划，增加或删除计划<br>
- 完成即可隐藏计划功能<br>
- 根据完成度计算百分数<br>
- 日历的制作<br>
- 点击上、下月实现月份跳转<br>
- 根据百分数计算颜色,动态添加到日历上<br>
- 编辑日志：日志标题、内容<br>
- 上传图片功能的实现<br>
- 查看、删除日志功能<br>



## 项目启动过程：

- 启动mongo：D:\acabz\mongo\MongoDB\Server\4.0\bin\mongod --dbpath D:\acabz\mongo\data\db         连接数据库<br>
- 启动tomcat：startup.bat            可以暂时允许浏览器访问指定文件夹的文件<br>
- 启动node： cd express_plan          /              node app.js<br>
- 启动Robo3T：数据可视化工具<br>

