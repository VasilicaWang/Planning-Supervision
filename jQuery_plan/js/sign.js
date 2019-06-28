$(function(){
    /* 注册登录切换 */
    $('.sign_content').on('click', '.signIn .turn', function () {
        $('.signIn').css('display', 'none');
        $('.register').css('display', 'block');
    })
    $('.sign_content').on('click', '.register .turn', function () {
        $('.register').css('display', 'none');
        $('.signIn').css('display', 'block');
    })

    /* 格式验证 */
    /**注册验证：用户名验证、密码验证、确认密码验证、是否同意注册协议验证 */
    

})