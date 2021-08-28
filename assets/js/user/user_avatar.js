$(function () {

    // 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 配置选项
    const options = {
        aspectRatio: 1,// 纵横比
        preview: '.img-preview'// 指定预览区域
    }

    // 创建裁剪区域
    $image.cropper(options)
    // 模拟点击事件
    $('#btnChooseImage').on('click', function () {
        $('#file').click();
    })

    // 为file框绑定change事件
    $('#file').on('change', function (e) {
        let filelist = e.target.files;
        if (filelist.length === 0) {
            return layui.layer.msg('请选择文件！');
        }

        // 将图片文件转化为路径
        let file = e.target.files[0]
        let imgURL = URL.createObjectURL(file)
        // 销毁旧的裁剪区域并重新初始化
        $image.cropper('destroy').attr('src', imgURL).cropper(options)

    })

    // 上传头像
    $('#btnUpload').on('click', function () {
        // 将 Canvas 画布上的内容，转化为 base64 格式的字符串 
        var dataURL = $image.cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 100,
            height: 100
        }).toDataURL('image/png')

        // 调用接口，上传头像
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: (res) => {
                if (res.status !== 0) {
                    return layui.layer.msg('更换头像失败！');
                }

                layui.layer.msg('更换成功！');
                window.parent.getUserInfo();
            }
        })
    })
})