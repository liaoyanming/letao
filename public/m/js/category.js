$(function(){
	// 根据后台数据渲染一级分类菜单
	getFirstCategoryData(function(data){
		$('.cate_left ul').html(template('firstTemplate',data));

		// 根据一级分类的ID渲染对应的二级分类菜单
		var categoryId=$('.cate_left ul li:first-child').find('a').attr('data-id');
		render(categoryId);
	});

    //点击一级分类加载对应的二级分类
    $('.cate_left').on('tap','a',function(e){
        if($(this).parent().hasClass('now')) return false;
        $('.cate_left li').removeClass('now');
        $(this).parent().addClass('now');
        render($(this).attr('data-id'))
    })
})

// 获取一级分类数据
var getFirstCategoryData = function (callback) {
    $.ajax({
        url:'/category/queryTopCategory',
        type:'get',
        data:'',
        dataType:'json',
        success:function (data) {
            callback && callback(data);
        }
    });
};

//获取二级分类数据
var getSecondCategoryData = function (params,callback) {
    $.ajax({
        url:'/category/querySecondCategory',
        type:'get',
        data:params,
        dataType:'json',
        success:function (data) {
            callback && callback(data);
        }
    });
};

// 渲染输数据
var render=function(categoryId){
	getSecondCategoryData(
	{id:categoryId},
	function(data){
		$('.cate_right ul').html(template('secondTemplate',data));
	}
	);
}