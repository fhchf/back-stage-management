$(function () {

    let form = layui.form;
    let layer = layui.layer;
    let laypage = layui.laypage;
    const parameter = {
        pagenum: 1,   // 页码值，默认请求第一页
        pagesize: 2,  // 每页显示几条数据，默认2条
        cate_id: '',  // 文章分类Id
        state: ''     // 文章的发布状态
    }

    // 时间过滤器
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data);

        let y = dt.getFullYear();
        let m = padZero(dt.getMonth() + 1);
        let d = dt.getDate();

        let hh = padZero(dt.getHours());
        let mm = padZero(dt.getMinutes());
        let ss = padZero(dt.getSeconds());

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    }
    // 补零
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    initTable();
    initCate();


    // 获取文章数据列表
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: parameter,
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！');
                }

                let htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 渲染分页
                renderPage(res.total);
            }
        })
    }

    // 初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！');
                }

                let htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 更新渲染
                form.render();
            }
        })
    }

    // 筛选
    $('#form-search').on('submit', function (e) {
        e.preventDefault();

        let cate_id = $('[ name=cate_id]').val();
        let state = $('[name=state]').val();
        parameter.cate_id = cate_id;
        parameter.state = state;
        initTable();
    })

    // 渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: parameter.pagesize,
            curr: parameter.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 5, 8, 10, 15],
            // 切换分页的回调
            jump: (obj, first) => {
                parameter.pagenum = obj.curr;
                parameter.pagesize = obj.limit;

                // 防止死循环
                if (!first) {
                    initTable();
                }
            }
        })
    }

    // 删除文章
    $('tbody').on('click', '.btn-delete', function () {
        let id = $(this).attr('data-id');
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: res => {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！');
                    }

                    layer.msg('删除成功！');
                    initTable();
                }
            })

            layer.close(index);
        });
    })





})