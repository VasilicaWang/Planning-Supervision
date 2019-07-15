$(function () {
    /* 注册登录切换 */
    $('.sign_content').on('click', '.signIn .turn', function () {
        $('.signIn').css('display', 'none');
        $('.register').css('display', 'block');
        $('.name').val('');
        $('.password').val('');
    })
    $('.sign_content').on('click', '.register .turn', function () {
        $('.register').css('display', 'none');
        $('.signIn').css('display', 'block');
        $('.userName').val('');
        $('.userpwd').val('');
        $('.confirmpwd').val('');
        $('.remind').text('');
    })

    /* 格式验证 */ 
    /**注册验证：用户名验证、密码验证、确认密码验证、是否同意注册协议验证 */
    $('#register').on('click', function () {
        if ($('.userName').val().length <= 6) {
            if($('.userpwd').val().length >= 6) {
                if($('.confirmpwd').val() == $('.userpwd').val()){
                    if ($('.checkbox').get(0).checked) {                        
                        axios.post('http://localhost:3000/newUser', {
                            userName: $('.userName').val(),
                            userpwd: $('.userpwd').val()
                        }).then(res => {
                            if(res.data == '注册成功') {
                                alert(res.data);
                                location.href = "./index.html";
                            }else{
                                alert(res.data);
                            }
                        }).catch(err => {
                            console.log(err);
                        });
                        $('.remind').text() = null;
                    } else {
                        $('.remind').text('注册请勾选注册协议');
                    }
                }else{
                    $('.remind').text('两次密码不一致');
                }
            }else{
                $('.remind').text('密码长度不能少于6个字符');
            }
        }else{
            $('.remind').text('用户名应小于6个字符');
        }        
    })

    
    $('#signIn').on('click', function() {
        axios.post('http://localhost:3000/user', {
            name: $('.name').val(),
            password: $('.password').val()
        }).then(res => {
            console.log(res.data)
            if(res.data.message == '登录成功'){
                location.href = "./index.html?userName="+res.data.name;
            } else {
                alert(res.data.message);
            }
        }).catch(err => {
            console.log(err);
        })
    })

})