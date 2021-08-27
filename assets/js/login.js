$(function () {
    // 去注册账号
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').fadeIn();
    })

    // 去登录
    $('#link_login').on('click', function () {
        $('.reg-box').hide();
        $('.login-box').fadeIn();
    })


    // layui 自定义校验规则
    var form = layui.form;
    form.verify({
        uname: [
            /^\w{2,12}$/
            , '用户名格式错误，请重新输入！'
        ],
        pwd: [
            /^[A-Za-z0-9-+*//]{6,12}$/
            , '密码格式错误，请重新输入！'
        ],
        repwd: function (value) {
            let pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) return '两次输入密码不一致'
        }
    })


    // 监听注册表单的提交事件
    var layer = layui.layer;
    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        $.post('/api/reguser', {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功，请登录！');
            $('#link_login').click();
        })
    })


    // 监听登录表单的提交事件
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！请检查用户名和密码')
                }
                layer.msg('登录成功！');
                localStorage.setItem('token', res.token);
                location.href = '/index.html';
            }
        })
    })
})