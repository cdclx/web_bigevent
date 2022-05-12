$(function () {
    var form = layui.form

    form.verify({
        pwd: [/^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        //判断原密码和新密码是不是一样的
        samePwd: function (value) {
            console.log($('[name=oldPwd]').val())
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        //第二遍输入的密码是否一致
        rePwd: function (value) {
            if (value) {
                if (value !== $('[name=newPwd]').val()) {
                    return '两次输入的密码不一致！'
                }
            }
        }
    })

    //更新密码信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功！')
                //重置表单
                //把jquery对象转换成原生的dom对象
                $('.layui-form')[0].reset()
            }
        })
    })
})