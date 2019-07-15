$(function () {
    $(".header_title img").on("click", function () {
        location.href = "./index.html?userName=" + ($('#userName').text());
    });
    $('#userName').text(decodeURI(location.search.match(new RegExp("[\?\&]userName=([^\&]+)", "i"))[1]));
    $('.nav .index').on('click', function () {
        location.href = "./index.html?userName=" + ($('#userName').text());
    });
    $('.nav .achievement').on('click', function () {
        location.href = "./achievement.html?userName=" + ($('#userName').text());
    });
    $('.nav .notepad').on('click', function () {
        location.href = "./notepad.html?userName=" + ($('#userName').text());
    })
})