$(function () {
    var layer = layui.layer
    var form = layui.form

    initArtCateList()
    //获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                var html = template('tpl-table', res)
                $('tbody').html(html)
            }
        })
    }

    var indexAdd = null
    //为添加类别按钮绑定点击事件
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    //通过代理的形式为form表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        //阻止默认提交
        e.preventDefault()
        // console.log('ok');
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            //快速获取表单数据
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                //根据索引关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    //通过代理的形式为btn-edit按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        // console.log('ok');
        //弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id')
        // console.log(id)
        //发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res)
                form.val('form-edit', res.data)
            }
        })
    })

    //通过代理的形式为修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        //阻止默认提交行为
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败，请检查输入格式')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    //通过代理的形式，为删除按钮绑定点击事件
    $('body').on('click', '.btn-delete', function () {
        // console.log('ok');
        var id = $(this).attr('data-id')
        // console.log(id)
        //提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    // console.log(res)
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })

})