<template>
	<view class="fist-nav">
		<view class="zhangben">
			账本
		</view>
		<view class="sousuo">
			搜索
		</view>
		<view class="gengduo">
			+
		</view>
	</view>

</template>

<script>
	export default {
		name: "firstNav",
		data() {
			return {};
		}
	}
</script>

<style>
	@import url("/static/fonts/iconfont.css");

	.fist-nav {
		display: flex;
		flex-direction: row;
		width: 100%;
		position: fixed;
		top: 50rpx;
		left: 0;
		height: 50rpx;
		line-height: 45rpx;
		background-color: #FFFFFF;
		text-align: center;
	}

	.zhangben {
		flex-grow: 1;
		color: #000000;
		text-align: center;
		font-size: 35rpx;
		margin-bottom: 5rpx;
	}

	.sousuo {
		flex-grow: 3;
		color: #000000;
		text-align: center;
		font-size: 25rpx;
		background-color: #C8C7CC;
		border-radius: 10rpx;
		margin-bottom: 5rpx;
	}

	.gengduo {
		flex-grow: 1;
		color: #000000;
		text-align: center;
		font-size: 35rpx;
		margin-bottom: 5rpx;
	}
</style>
