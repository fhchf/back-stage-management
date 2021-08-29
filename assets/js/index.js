$(function () {

    getUserInfo();

    // 用户退出
    $('#btnLogout').on('click', function () {
        layui.layer.confirm('是否退出登录？', { icon: 3, title: '提示' }, function (index) {
            localStorage.removeItem('token');
            location.href = '/login.html';
            // layui方法 关闭询问框
            layer.close(index);
        });
    })



})

// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }

            renderAvatar(res.data);
        }

    })
}

// 渲染用户头像
function renderAvatar(user) {
    let name = user.nickname || user.username;
    let time = getTime();
    $('#welcome').html(time + '&nbsp;&nbsp' + name);
    $('.userinfo').show();
    if (user.user_pic !== null) {
        $('.text-avatar').hide();
        $('.layui-nav-img').attr('src', user.user_pic).show();
    } else {
        $('.layui-nav-img').hide();
        let first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}

// 时间
function getTime() {
    let time = new Date();
    let h = time.getHours();
    return h > 19 ? '晚上好' : h > 12 ? '下午好' : h > 10 ? '中午好' : h > 7 ? '上午好' : h > 4 ? '早上好' : '晚上好'
}

// 发布文章页面跳转
function artList() {
    $('#artList').click();
}