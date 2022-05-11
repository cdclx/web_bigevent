$(function () {
    //调用函数获取用户基本信息
    getUserInfo()
    //点击按钮，实现退出的功能
    $('#btnLogout').on('click', function () {
        // console.log('ok')
        var layer = layui.layer
        //提示用户是否确认退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            //1、清空本地存储中的token
            localStorage.removeItem('token')
            //2、重新跳转到登录页面
            // console.log('ok');
            location.href = '../../../../黑马node.js/blog/login.html'
            //关闭confirm询问框
            layer.close(index);
        });
    })
})

//获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //headers就是请求头配置对象
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            //调用函数renderAvatar渲染用户的头像
            renderAvatar(res.data)
        }
    })
}

//渲染用户的头像
function renderAvatar(user) {
    //1、获取用户的昵称
    var name = user.nickname || user.username
    //2、设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    //3、按需渲染用户的头像
    if (user.user_pic !== null) {
        //3.1、渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        //隐藏文本头像
        $('.text-avatar').hide()
    } else {
        //3.2、渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        console.log(first);
        $('.text-avatar').html(first).show()
    }
}