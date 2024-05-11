<template>
	<view class="root">
		<hx-navbar ref="hxnb" :config="config" />
		<view class="page">
			<view class="total-card"></view>
		    <web-view src="http://xxxxxxx.com/yinsixieyi.html"></web-view>	
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				config:{
					 title: '隐私协议',
				     backgroundColor: [1,['#a9a1ff','#6970ff']]			
					}
			}
		},
		onLoad(){
		    // #ifdef APP-PLUS
				var height = 0; //定义动态的高度变量，如高度为定值，可以直接写
				uni.getSystemInfo({
					//成功获取的回调函数，返回值为系统信息
					success: (sysinfo) => {
						height = sysinfo.windowHeight; //自行修改，自己需要的高度 此处如底部有其他内容，可以直接---(-50)这种
					},
					complete: () => {}
				});
				var currentWebview = this.$scope.$getAppWebview(); //获取当前web-view
				setTimeout(function() {
					var wv = currentWebview.children()[0];
					wv.setStyle({ //设置web-view距离顶部的距离以及自己的高度，单位为px
						top:65 , //此处是距离顶部的高度，应该是你页面的头部 40  65
						height:  height , //webview的高度
						scalable: true, //webview的页面是否可以缩放，双指放大缩小,
					})
				}, 500); //如页面初始化调用需要写延迟
			 // #endif
		},
		methods: {
			
		}
	}
</script>

<style>
	.root{
		width: 100%;
		display: flex;
		flex-direction: column;
		height: 100%;
		background-color: #FFFFFF;
	}
	
	.page {
		background-color: #FFFFFF;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-direction: column;
	}
	.total-card{
		margin-top: 0prx;
		height: 20%;
	}
</style>
