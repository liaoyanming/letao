$(function(){
	// 区域滚动
	mui('.mui-scroll-wrapper').scroll({
        indicators:false
    });

    //初始化页面  自动下拉刷新
    mui.init({
    	pullRefresh:{
    		container:'#refreshContainer',
    		down:{
    			auto:true,
    			callback:function(){
    				var that=this;
    				setTimeout(function(){
    					getCartData(function(data){
                            //渲染页面
                            $('.mui-table-view').html(template('cart',data));
                            
                            //结束下拉刷新
                            that.endPulldownToRefresh();

                            //点击刷新按钮时重新触发下拉刷新
                            $('.fa-refresh').off('click').on('tap',function(){
                                that.pulldownLoading();
                            });
                        })
    				},1000);
    			}
    		}
    	}
    });

    //左滑点击编辑按钮弹出编辑框，编辑后重新提交数据，提交数据后重新刷新购物车详情页面
    $('.mui-table-view').on('tap','.mui-icon-compose',function(){
        var id=$(this).parent().attr('data-id');
        var item=LT.getItemById(window.cartData.data,id);
        var html=template('edit',item);
        mui.confirm(html.replace(/\n/g,''), '商品编辑', ['确认', '取消'], function(e) {
            if (e.index == 0) {
                var size=$('.btn_size.now').html();
                var num=$('.p_number input').val();
                LT.loginAjax({
                    url:'/cart/updateCart',
                    type:'post',
                    data:{
                        id:id,
                        size:size,
                        num:num
                    },
                    dataType:'json',
                    success:function(data){
                        if (data.success==true) {
                            item.size=size;
                            item.num=num;
                            $('.mui-table-view').html(template('cart',window.cartData));
                        }
                    }
                })
                
            } else {
                //TODO
            }
        })
    });

    //更改弹出框尺码选择样式
    $('body').on('tap','.p_size span',function(){
        $(this).addClass('now').siblings().removeClass('now');
    })

    //更改弹出框数量
    $('body').on('tap','.p_number span',function(){
        var $input=$(this).siblings('input');
        var currNum=$input.val();
        var maxNum=parseInt($input.attr('data-max'));
        if ($(this).hasClass('jian')) {
            if (currNum <= 1) {
                mui.toast('至少一件商品');
                return false;
            }
            currNum--;
        } else {
            if (currNum >= maxNum) {
                setTimeout(function(){
                    mui.toast('库存不足');
                },100);
                return false;
            }
            currNum++
        }
        $input.val(currNum);
    });   
});

//获取登陆后购物车数据
var getCartData=function(callback){
	LT.loginAjax({
		url:'/cart/queryCartPaging',
		type:'get',
		data:{
			page:1,
			pageSize:100
		},
		dataType:'json',
		success:function(data){
             window.cartData = data;
			callback&&callback(data);
		}
	});
}