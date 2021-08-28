$(function () {


    let form = layui.form;
    let layer = layui.layer;

    // 格式判断
    form.verify({
        pwd: [
            /^[A-Za-z0-9-+*//]{6,12}$/
            , '密码格式错误，请重新输入！'
        ],
        samePwd: (value) => {
            if (value === $('[name="oldPwd"]').val()) {
                return '新密码与原密码相同，请重新输入！';
            }
        },
        rePwd: (value) => {
            if (value !== $('[name="newPwd"]').val()) {
                return '两次输入密码不一致！';
            }
        }
    })

    // 监听表单提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg('更改密码失败！');
                }

                layer.msg('更改密码成功！');
                // 原生js重置表单
                $(this)[0].reset();
            }
        })
    })

})