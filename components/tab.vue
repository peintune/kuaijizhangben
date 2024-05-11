<template>
	<view>
		<jizhang ref="jizhang"></jizhang>
		<oneLogin ref="oneLogin"></oneLogin>

		<view class="tab" :style="{'padding-bottom': paddingBottomHeight + 'rpx'}">
			<!-- <navigator open-type="switchTab"  url="../pages/zhangdan/zhangdan" class="tab-box-shouye" :class="['',selectNum== 0?'xuanzhong':'']" @click="tabclick(0)">
				首页
			</navigator> -->
			
			<!-- <navigator open-type="switchTab" url="/pages/zhangdan/zhangdan" class="tab-box-shouye" hover-class ="navigator-hover">
				首页
			</navigator>
			<navigator open-type="switchTab" url="/pages/tongji/tongji" class="tab-box-tongji" >
				统计
			</navigator>
			<view  class="tab-box-jiyibi" @tap="openJiZhangPage">
				记一笔
			</view>

			<navigator open-type="switchTab" url="/pages/zhanghu/zhanghu" class="tab-box-zhanghu" >
				资产
			</navigator>
			<navigator open-type="switchTab" url="/pages/wode/wode" class="tab-box-wode" >
				我的
			</navigator>
			 -->
			
			<view  class="tab-box-shouye"  :class="['',selectNum== 0?'xuanzhong':'']" @click="tabclick(0)" >
				账本
			</view>
			<view  class="tab-box-tongji" :class="['',selectNum== 1?'xuanzhong':'']" @click="tabclick(1)">
				统计
			</view>
			<view  class="tab-box-jiyibi" @tap="openJiZhangPage">
				记一笔
			</view>
			<!-- <view class="tab-box-shequ" >
				社区
			</view> -->
			<view  class="tab-box-zhanghu" :class="['',selectNum== 2?'xuanzhong':'']" @click="tabclick(2)" >
				资产
			</view>
			<view class="tab-box-wode" :class="['',selectNum== 3?'xuanzhong':'']" @click="tabclick(3)">
				我的
			</view>
		</view>
	</view>

</template>

<script>
	import jizhang from './jizhang.vue'
	import oneLogin from './oneLogin.vue'
	import common from "@/common/common.js"

	export default {
		name: "tab",
		components: {
			oneLogin,
			jizhang
		},
		data() {
			return {
				selectNum:5,
				paddingBottomHeight: 0,  //苹果X以上手机底部适配高度

			};
		},
		onLoad() {
		},
		mounted: function() {
			uni.$on('switchTab',function(data){
				//this.selectNum = data.data;
					//console.log('监听到事件来自 update ，携带参数 msg 为：' + data.data);
				});
		},
	  created() {
			let that = this;
			uni.getSystemInfo({
				success: function (res) {
					let model = ['X', 'XR', 'XS', '11', '12', '13', '14', '15'];
					model.forEach(item => {
						//适配iphoneX以上的底部，给tabbar一定高度的padding-bottom
						if(res.model.indexOf(item) != -1 && res.model.indexOf('iPhone') != -1) {
							that.paddingBottomHeight = 40;
						}
					})
				}
			});
		},
		methods: {
			openJiZhangPage() {
				// var {userId} = common.getLoginState()
				// var userActionLog = {
				// 	actionType:'open',
				// 	objectType:'tab.jizhang',
				// 	username: userId,
				// 	createTime: new Date()
				// }
				// common.insertUserActionLog(userActionLog)
				
				var {isLogin} = common.getLoginState()
				if (!isLogin){
					//this.$refs.oneLogin.openOneLoginPage();
					this.$refs.jizhang.close()
					
					uni.showToast({
						title:"请先登录",
						mask:true,
						icon:'none',
						duration:2000,
					})
				}
				this.$refs.jizhang.open();
			},
			setNumber(number){
				this.selectNum = number;
			},
			tabclick(number) {
				this.selectNum = number;
			 //    uni.$emit('switchTab',{
				// 	'data':number
				// })  
				//console.log(number)
				
				// if (number == 0) {
				// 	uni.reLaunch({
				// 		url: '/pages/zhangdan/zhangdan'
				// 	});					
				// } else if (number == 1) {
				// 	uni.reLaunch({
				// 		url: '/pages/tongji/tongji'
				// 	});					
				// }else if (number == 2) {
				// 	uni.reLaunch({
				// 		url: '/pages/zhanghu/zhanghu'
				// 	});				
				// }else if (number == 3) {
				// 	uni.reLaunch({
				// 		url: '/pages/wode/wode'
				// 	});
				// };
				
				// var {userId} = common.getLoginState()
				// var userActionLog = {
				// 	actionType:'update',
				// 	objectType:'tab.switch-'+number,
				// 	username: userId,
				// 	createTime: new Date()
				// }
				// common.insertUserActionLog(userActionLog)
				
				if (number == 0) {
					uni.switchTab({
						url: '/pages/zhangdan/zhangdan'
					});					
				} else if (number == 1) {
					uni.switchTab({
						url: '/pages/tongji/tongji'
					});					
				}else if (number == 2) {
					uni.switchTab({
						url: '/pages/zhanghu/zhanghu'
					});				
				}else if (number == 3) {
					uni.switchTab({
						url: '/pages/wode/wode'
					});
				};
			},
		}
	}
</script>

<style>
	@import url("/static/fonts/iconfont.css");
	.tab {
		height: 100rpx;
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		border-style: solid none none none;
		border-width: 1rpx;
		border-color: #d7d8db;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.tab-box-shouye {
		margin-left: 20rpx;
		text-align: center;
		width: 20%;
		height: 60%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.xuanzhong{
		border-radius: 20rpx;
		color: #5a79ff;
		font-size: 40rpx;
		font-weight: bold;
	}
	
	.tab-box-tongji {
		text-align: center;
		width: 20%;
		height: 60%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.tab-box-shequ {
		text-align: center;
		width: 20%;
		height: 60%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.hoverClass{
		font-size: 2rpx;
	}
	.navigator-hover{
		background-color: #5a79ff;
		opacity: 0.7;
	}
	
	.tab-box-zhanghu {
		text-align: center;
		width: 20%;
		height: 60%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.tab-box-wode {
		text-align: center;
		width: 20%;
		margin-right: 20rpx;
	}

	.tab-box-jiyibi {
		margin-top: 10rpx;
		margin-bottom: 10rpx;
		width: 30%;
		color: #FFFFFF;
		background-image: linear-gradient(to bottom right, #5a79ff, #7392ff);
		border-radius: 20rpx;
		height: 70rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: bold;
	}
</style>
