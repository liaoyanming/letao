// 把搜索中心页传过来的数据转化为对象 例如：{key: "1", name: "ll"}
window.LT={};
LT.getParamsByUrl=function(){
	var params={};
	var search=location.search;
	if (search) {
		search=search.replace('?','');
		var arr=search.split('&');
		arr.forEach(function(item,i){
			var itemArr=item.split('=');
			params[itemArr[0]]=itemArr[1];
		})
	}
	return params;
};
//把序列化字符串转成对象
LT.serialize2object = function (serializeStr) {
    var obj = {};
    /*key=value&k=v*/
    if(serializeStr){
        var arr = serializeStr.split('&');
        arr.forEach(function (item,i) {
            var itemArr = item.split('=');
            obj[itemArr[0]] = itemArr[1];
        })
    }
    return obj;
}

//获取购物车编辑商品对应的商品数据
LT.getItemById=function(arr,id){
	var obj=null;
	arr.forEach(function(item,i){
		if (item.id==id) {
			obj=item;
		}
	})
	return obj;
}

LT.loginUrl='/m/user/login.html';

LT.cartUrl='/m/user/cart.html';

LT.usertUrl='/m/user/index.html';

LT.loginAjax=function(params){
	$.ajax({
		url: params.url || '#',
		type:params.type||'get',
		data:params.data||'',
		dataType:params.dataType||'json',
		success:function(data){
			if (data.error == 400) {
				location.href=LT.loginUrl+'?returnUrl='+location.href;
				return false;
			} else {
				params.success && params.success(data);
			}
		},
		error:function(){
			mui.toast('系统繁忙');
		}
	})
}
