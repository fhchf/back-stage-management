$.ajaxPrefilter(function (options) {
    // 统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url

    // 统一为有权限的接口，设置 headers 请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载 complete 回调函数
    // 身份验证，防止直接访问后台
    // 在 complete 回调函数中，使用 res.responseJSON 得到响应回来的数据
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token');
            location.href = '/login.html';
        }
    }




})