$(function () {

    let form = layui.form;
    let layer = layui.layer;

    // 信息格式判断
    form.verify({
        nickname: [
            /^[\u4e00-\u9fa5\w]{2,10}$/
            , '呢称格式错误，请重新输入！'
        ]
    });

    initUserInfo();
    // 初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！');
                }

                form.val('formUserInfo', res.data);
            }
        })
    }

    // 重置表单数据
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    });

    // 监听表单提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg('修改用户信息失败！');
                }

                layer.msg('更新用户信息成功！');
                // 调用父页面中的函数，重新渲染信息
                window.parent.getUserInfo();
            }
        })
    });



})