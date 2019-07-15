$(function () {
    /* logo点击事件 */
    $(".header_title img").on("click", function () {
        location.href = "./index.html?userName=" + ($('#userName').text());
    });
    
    /* 将登录用户名放到页面中 */
    $('#userName').text(decodeURI(location.search.match(new RegExp("[\?\&]userName=([^\&]+)", "i"))[1]));
    
    /* 导航栏点击事件 */
    $('.nav .index').on('click', function () {
        location.href = "./index.html?userName=" + ($('#userName').text());
    });
    $('.nav .achievement').on('click', function () {
        location.href = "./achievement.html?userName=" + ($('#userName').text());
    });
    $('.nav .notepad').on('click', function () {
        location.href = "./notepad.html?userName=" + ($('#userName').text());
    });

    /* 退出点击事件 */
    $('.quitAccount').on('click', function() {
        location.href = "./sign.html";
    })
    
})