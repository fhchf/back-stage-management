$(function () {

    let layer = layui.layer;
    let form = layui.form;

    // 初始化富文本
    initEditor();

    initCate();
    // 加载文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！');
                }

                let htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 更新渲染
                form.render();
            }
        })
    }

    // 初始化图片裁剪器
    let $image = $('#image')
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    $image.cropper(options)

    // 模拟上传文件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    // 获取用户选择的文件
    $('#coverFile').on('change', function (e) {
        let files = e.target.files;
        if (files.length === 0) {
            return layer.msg('请选择文件！');
        }

        // 转换为URL
        var file = e.target.files[0];
        let newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    let art_state = '已发布';
    $('#btnSave2').on('click', function () {
        art_state = '草稿';
    })

    // 获取填写的数据
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        let fd = new FormData($(this)[0]);
        fd.append('state', art_state);

        // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $image.cropper('getCroppedCanvas', {
            width: 400,
            height: 280
        }).toBlob(function (blob) {
            // 将文件，存储到 fd 中
            fd.append('cover_img', blob);
            // 发起请求，提交数据
            publishArticle(fd);
        })

    })

    // 提交数据
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：提交 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！');
                }

                layer.msg('发布文章成功！');
                window.parent.artList();
            }
        })
    }






})