$(function () {

    let form = layui.form;
    // 格式判断
    form.verify({
        classification: function (value) {
            if (value.length > 12 || value.length < 2) {
                return '名称与别名长度必须在2-12位之间！';
            }
        }

    })

    initArtCateList();
    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: res => {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章分类列表失败！');
                }

                let htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }

    // 弹出层
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加类别',
            content: $('#dialog-add').html()
        })
    })

    // 新增分类 事件委托
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) {
                    return layui.layer.msg('新增分类失败！');
                }

                initArtCateList();
                layui.layer.msg('新增分类成功！');
                // 关闭层
                layui.layer.close(indexAdd);
            }

        })
    })

    // 取消层
    $('body').on('click', '.dialogCancel', function () {
        layui.layer.close(indexAdd) || layui.layer.close(indexEdit);
    })

    // 编辑文章类别 事件委托
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章类别',
            content: $('#dialog-edit').html()
        })

        let id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: res => {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章分类数据失败！');
                }

                form.val('form-edit', res.data);
            }
        })
    })

    // 更新文章类别
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) {
                    return layui.layer.msg('修改分类数据失败！');
                }

                layui.layer.msg('修改分类数据成功！');
                layui.layer.close(indexEdit);
                initArtCateList();
            }
        })
    })

    // 删除类别 事件委托
    $('tbody').on('click', '.btn-delete', function () {
        let id = $(this).attr('data-id');
        layui.layer.confirm('确认删除？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: res => {
                    if (res.status !== 0) {
                        return layui.layer.msg('删除分类失败！');
                    }

                    layui.layer.msg('删除分类成功！');
                    layui.layer.close(index);
                    initArtCateList();
                }
            })

            layui.layer.close(index);
        });


    })
})