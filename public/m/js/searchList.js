$(function(){
	// 滚动效果
	mui('.mui-scroll-wrapper').scroll({
	indicators: false
    });

    // 页面初始化的时候，搜索中心页传过来的关键字要显示
    var urlParams=LT.getParamsByUrl();
    var $input=$('input').val(urlParams.key||'');

    //页面初始化时根据关键字查询第一页数据4条
    getSearchData({
    	proName:urlParams.key,
    	page:1,
    	pageSize:4
    },function(data){
    	$('.lt-product').html(template('list', data))
    });

    //点击搜索时重新获取关键字后重新渲染页面
    $('.lt-search a').on('tap',function(){
    	var key=$.trim($input.val());
    	if (!key) {
    		mui.toast('请输入关键字');
    	}
    	getSearchData({
	    	proName:key,
	    	page:1,
	    	pageSize:4
    	},function(data){
    		$('.lt-product').html(template('list', data))
    	});
    });

    //用户点击排序的时候  根据排序的选项去进行排序（默认的时候是 降序  再次点击的时候 升序）
    $('.lt-order a').on('tap',function(){
    	var $this=$(this);
    	
    	if (!$this.hasClass('now')) {
    		$this.addClass('now').siblings().removeClass('now').find('span')
    		.removeClass('fa-angle-up').addClass('fa-angle-down');
    	} else {
    		if ($this.find('span').hasClass('fa-angle-down')) {
    			$this.find('span').removeClass('fa-angle-down').addClass('fa-angle-up');
    		} else {
    			$this.find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
    		}
    	}

    	var order=$this.attr('data-order');
    	var orderVal=$this.find('span').hasClass('fa-angle-up')?1:2;
    	var key=$.trim($input.val());
    	if (!key) {
    		mui.toast('请输入关键字');
    	}

    	var params={
	    	proName:key,
	    	page:1,
	    	pageSize:4
    	}
    	params[order]=orderVal;
    	getSearchData(params,function(data){
    		$('.lt-product').html(template('list', data))
    	});

    });

    //用户下拉的时候  根据当前条件刷新 上拉加载重置  排序功能也重置 
    //用户上拉的时候  加载下一页（没有数据不去加载了）
    mui.init({
        pullRefresh: {
            /*下拉容器*/
            container: "#refreshContainer",
            /*下拉*/
            down: {
                /*最近跟新的功能*/
                /*style:'circle',*/
                /*自动加载*/
                auto: true,
                callback: function () {
                    /*组件对象*/
                    var that = this;
                    var key = $.trim($input.val());
                    if (!key) {
                        mui.toast('请输入关键字');
                        return false;
                    }

                    /*排序功能也重置*/
                    $('.lt-order a').removeClass('now').find('span').removeClass('fa-angle-up').addClass('fa-angle-down');

                    getSearchData({
                        proName: key,
                        page: 1,
                        pageSize: 4
                    }, function (data) {
                        setTimeout(function () {
                            /*渲染数据*/
                            $('.lt-product').html(template('list', data));
                            /*注意：停止下拉刷新*/
                            that.endPulldownToRefresh();
                            /*上拉加载重置*/
                            that.refresh(true);
                        }, 1000);
                    });
                }
            },
            /*上拉*/
            up: {
                callback:function () {
                    window.page ++;
                    /*组件对象*/
                    var that = this;
                    var key = $.trim($input.val());
                    if (!key) {
                        mui.toast('请输入关键字');
                        return false;
                    }

                    /*获取当前点击的功能参数  price 1 2 num 1 2*/
                    var order = $('.lt-order a.now').attr('data-order');
                    var orderVal = $('.lt-order a.now').find('span').hasClass('fa-angle-up') ? 1 : 2;
                    /*获取数据*/
                    var params = {
                        proName: key,
                        page: window.page,
                        pageSize: 4
                        /*排序的方式*/
                    };
                    params[order] = orderVal;
                    getSearchData(params, function (data) {
                        setTimeout(function () {
                            /*渲染数据*/
                            $('.lt-product').append(template('list', data));
                            /*注意：停止上拉加载*/
                            if(data.data.length){
                                that.endPullupToRefresh();
                            }else{
                                that.endPullupToRefresh(true);
                            }

                        }, 1000);
                    });
                }
            }
        }
    });
   
});

//获取后台数据
var getSearchData=function(params,callback){
	$.ajax({
		url:'/product/queryProduct',
		type:'get',
		data:params,
		dataType:'json',
		success:function(data){
            window.page=data.page;
			callback&&callback(data);
			
		}
	});
}