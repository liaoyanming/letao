$(function(){
	$('.lt-search a').on('tap',function(){
		// 跳转去搜索列表页并且要带上关键字
		var key=$.trim($('input').val());

		if(!key){
			mui.toast('请输入关键字');
		}

		location.href='searchList.html?key='+key;
	})
})