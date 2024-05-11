<template>
	<view class="root">
		<hx-navbar ref="hxnb" :config="config" />
		<view class="page">
			
			<view style="margin-top: 20rpx;">
			快记账本是由态古代科技（上海）有限公司开发。
			</view>
			<view style="margin-top: 20rpx;">
				如有任何问题可以联系我们 taigudai001@163.com
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				config:{
					 title: '关于我们',
				     backgroundColor: [1,['#a9a1ff','#6970ff']]			
					}
			}
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
</style>
