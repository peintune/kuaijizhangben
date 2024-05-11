<template>
	<view class="slider-verify-box" v-if="isShow">
		<view class="verifyBox">
			<view class="slider-title">图形验证</view>
			<view class="slide-content">
				<view class="slide-tips">拖动下方滑块完成拼图</view>
				<view class="slider-pintu">
					<image id="pintuImg" :src="'/static/images/slider-verify/' + img + '.jpg'" class="pintu"></image>

					<view class="pintukuai" :style="{ top: top + 'px', left: oldx + 'px' }">
						<image :src="'/static/images/slider-verify/' + img + '.jpg'" :style="{ top: '-' + top + 'px', left: '-' + left + 'px'}"></image>
					</view>

					<view class="yinying" :style="{ top: top + 'px', left: left + 'px' }"></view>
				</view>

				<view class="slider-movearea" @touchend="endTouchMove">
					<movable-area :animation="true"><movable-view :x="x" direction="horizontal" @change="startMove"></movable-view></movable-area>

					<view class="huadao">拖动左边滑块完成上方拼图</view>
				</view>
			</view>
			
			<view class="slider-btn-group">
				<view class="slider-btn" @tap="closeSlider">关闭</view>
				<view class="slider-btn slide-btn-refresh" @tap="refreshVerify">刷新</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'slider-verify',
	props: {
		isShow: true
	},
	data() {
		return {
			x: 0, //初始距离
			oldx: 0, //移动的距离
			img: '1', //显示哪张图片
			left: 0, //随机拼图的最终X轴距离
			top: 0, //拼图的top距离
		};
	},
	watch: {
		// 每次打开重新刷新拼图
		isShow(newValue, oldValue) {
			if(newValue){
				this.refreshVerify();	//刷新
			}
		}
	},
	mounted() {
		var that = this;
		that.refreshVerify();
	},
	methods: {
		//刷新验证
		refreshVerify() {
			var gl = Math.random().toFixed(2);
			this.left = uni.upx2px(560) * gl > uni.upx2px(280) ? uni.upx2px(280) : uni.upx2px(560) * gl + uni.upx2px(150); //生成随机X轴最终距离
			this.top = uni.upx2px(190) * gl; //生成随机Y轴初始距离
			
			if (gl <= 0.2) {
				this.img = 1;
			}
			if (gl > 0.2 && gl <= 0.4) {
				this.img = 2;
			}
			if (gl > 0.4 && gl <= 0.6) {
				this.img = 3;
			}
			if (gl > 0.6 && gl <= 0.8) {
				this.img = 4;
			}
			if (gl > 0.8 && gl <= 1) {
				this.img = 5;
			}
			
			this.resetMove();	//重置阴影位置
		},

		/* 滑动中 */
		startMove(e) {
			this.oldx = e.detail.x;
		},

		/* 滑动结束 */
		endTouchMove() {
			var that = this;

			if (Math.abs(that.oldx - that.left) <= 5) {
				that.$emit('touchSliderResult', true);
				
				// uni.showToast({
				// 	title: '验证成功',
				// 	duration: 2500,
				// 	success() {
				// 		that.$emit('touchSliderResult', true);
				// 	}
				// });
			} else {
				that.refreshVerify();
			}
		},
		
		/* 重置阴影位置 */
		resetMove() {
			this.x = 1;
			this.oldx = 1;
			setTimeout(() => {
				this.x = 0;
				this.oldx = 0;
			}, 300);
		},
		
		// 关闭
		closeSlider(){
			this.$emit('touchSliderResult', false);
		}	
	}
};
</script>

<style lang="less">
.slider-verify-box {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 999;
}
.verifyBox {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	// width: 85%;
	background-color: #fff;
	border-radius: 20upx;
	box-shadow: 0 0 5upx rgba(0, 0, 0);

	.slider-title {
		font-size: 36upx;
		text-align: center;
		padding: 1em 0;
		color: rgba(2, 20, 33, 0.85);
		border-bottom: 1px solid rgba(2, 20, 33, 0.15);
	}

	.slide-content {
		width: 560rpx;
		padding: 0 1em;
		margin: 0 auto;
		.slide-tips {
			font-size: 28rpx;
			color: rgba(2, 20, 33, 0.45);
			padding: 0.5em 0;
		}

		.slider-pintu {
			position: relative;
			width: 100%;
			border-radius: 10rpx;
			overflow: hidden;
			.pintu {
				width: 560rpx;
				height: 315rpx;
				display: block;
				margin: 0 auto;
			}

			.pintukuai {
				position: absolute;
				top: 0;
				left: 0;
				width: 120rpx;
				height: 120rpx;
				z-index: 100;
				box-shadow: 0 0 5upx rgba(0, 0, 0, 0.3);
				overflow: hidden;

				image {
					display: block;
					position: absolute;
					top: 0;
					left: 0;
					width: 560rpx;
					height: 315rpx;
				}
			}
		}

		.yinying {
			position: absolute;
			width: 120rpx;
			height: 120rpx;
			background-color: rgba(0, 0, 0, 0.5);
		}
	}
}

.slider-movearea {
	position: relative;
	height: 80upx;
	width: 100%;
	margin: 25upx auto;

	movable-area {
		height: 80upx;
		width: 100%;

		movable-view {
			width: 80upx;
			height: 80upx;
			border-radius: 50%;
			background-color: #007cff;
			background-image: url(../../static/images/slider-verify/icon-button-normal.png);
			background-repeat: no-repeat;
			background-size: auto 30upx;
			background-position: center;
			position: relative;
			z-index: 100;
		}
	}
}

.huadao {
	width: 100%;
	height: 66upx;
	line-height: 66upx;
	background: #eee;
	box-shadow: inset 0 0 5upx #ccc;
	border-radius: 40rpx;
	color: #999;
	text-align: center;
	box-sizing: border-box;
	position: absolute;
	top: 7rpx;
	left: 0;
	font-size: 28rpx;
	z-index: 99;
}

.slider-btn-group{
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	border-top: 1px solid rgba(2, 20, 33, 0.15);
	
	.slider-btn{
		flex: 1;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		font-size: 36rpx;
		color:rgba(2,20,33,0.85);
		&:active{
			opacity: 0.8;
		}
	}
	.slide-btn-refresh{
		color:rgba(14,107,176,1);
		border-left: 1px solid rgba(2, 20, 33, 0.15);
	}	
}
</style>
