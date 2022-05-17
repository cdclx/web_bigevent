$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    //定义美化事件的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    //定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //定义一个查询的定义参数对象,将来请求数据的时候,
    //需要将请求的参数对象提交到服务器
    var q = {
        pagenum: 1,//页码值,默认请求第一页的数据
        pagesize: 2,//每页显示几条的数据,默认每页显示2条
        cate_id: '',//文章分类的id
        state: ''//文章的发布状态
    }

    initTable()
    initCate()
    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(q);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败!')
                }
                console.log(res);
                //使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                //调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    //初始化文章分类的方法
    function initCate() {
        //初始化文章分类的方法
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                //调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //通过模板引擎把页面渲染好之后，通知layui重新渲染表单区
                form.render()
            }
        })
    }

    //为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        // console.log('点击了提交');
        e.preventDefault()
        //获取表单中选中项的值
        var cate_id = $('[name=cate_id').val()
        var state = $('[name=state').val()
        //为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        //根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })


    //定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        //调用laypage.render方法来渲染分页的结构
        //第一个参数：分页容器的id
        //第二个参数：总数据条数
        //第三个参数：每页显示几条数据
        //第四个参数：设置默认被选中的分页
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],//分页显示的数量
            //分页发生切换的时候触发
            //触发jump回调的方式有两种
            //1、点击页码值的时候，会触发jump回调
            //2、只要调用renderPage方法，就会触发jump回调
            jump: function (obj, first) {
                // console.log(first);
                // console.log(obj.curr);
                //把最新的页码值赋值到q这个查询对象中
                q.pagenum = obj.curr
                //把最新的条目数赋值到q这个查询参数对象的pagesize属性中
                q.pagesize = obj.limit
                //根据最新的q获取对应的数据列表，并渲染表格
                if (!first) {
                    initTable()
                }
            }
        })
    }

    //刷新当前页面
    $('.fresh').on('click', function () {
        location.reload();  //实现页面重新加载
    })

    //通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function () {
        //获取当前页面删除按钮的个数
        var len = $('.btn-delete').length
        // console.log(len);
        //获取到文章的id
        var id = $(this).attr('data-id')
        // console.log('ok');
        //询问用户是否要删除数据
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    //判断当前页码值是不是还有数据
                    //当数据删除完成后，需要判断当前页面中是否还有剩余的数据
                    //如果没用数据了，则让页码值-1之后，
                    //在重新调用initTable方法
                    if (len === 1) {
                        //如果len的值等于1，证明删除完毕后页面没有任何数据
                        //页码值最小值必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
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
            title: '修改文章内容',
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id')
        console.log(id)
        //发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/articles/' + id,
            success: function (res) {
                // console.log(res)
                form.val('form-edit', res.data)
                // console.log(res.data);
            }
        })
    })

    //通过代理的形式为修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        //阻止默认提交行为
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatearticle',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败，请检查输入格式')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                initTable()
            }
        })
    })
})