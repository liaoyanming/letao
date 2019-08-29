$(function(){
	var id=LT.getParamsByUrl().productId;
	getProductData(id,function(data){
		// 清除加载效果
		$('.loading').remove();
		//模板渲染
		$('.mui-scroll').html(template('detail',data));
		// 轮播图
		mui('.mui-slider').slider({
        	interval: 1000
    	});
        // 区域滚动
    	mui('.mui-scroll-wrapper').scroll({
        	indicators: false
    	});
    	//尺码选中样式
    	$('.btn_size').on('tap',function(){
    		$(this).addClass('now').siblings().removeClass('now');
    	})
    	//数量
    	$('.p_number span').on('tap',function(){
    		var $input=$(this).siblings('input');
    		var currNum=$input.val();
    		var maxNum=parseInt($input.attr('data-max'));
    		if ($(this).hasClass('jian')) {
    			if (currNum == 0) {
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
    	//加入购物车
    	$('.btn_addCart').on('tap',function(){
    		//尺码校验
    		var $changeBtn = $('.btn_size.now');
            if(!$changeBtn.length){
                mui.toast('请您选择尺码');
                return false;
            }
    		//数量校验
    		var num=$('.p_number input').val();
    		if (num <= 0) {
    			mui.toast('请您选择数量');
    			return false;
    		}
    		//加入购物车
    		LT.loginAjax({
                url:'/cart/addCart',
                type:'post',
                data:{
                    productId:id,
                    num:num,
                    size:$changeBtn.html()
                },
                dataType:'json',
                success:function (data) {
                    if(data.success == true){
                        /*弹出提示框*/
                        /*content*/
                        /*title*/
                        /*btn text []*/
                        /*click btn callback */
                        mui.confirm('添加成功，去购物车看看？', '温馨提示', ['是', '否'], function(e) {
                            if (e.index == 0) {
                                location.href = LT.cartUrl;
                            } else {
                                //TODO
                            }
                        })
                    }
                }
            });
    	})
	});
	    
})

//获取后台数据
var getProductData=function(productId,callback){
	$.ajax({
		url:'/product/queryProductDetail',
		type:'get',
		data:{id:productId},
		dataType:'json',
		success:function(data){
            setTimeout(function(){
            	callback&&callback(data);
            },1000);
		}
	});
}