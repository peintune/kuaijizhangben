<template>
	<view class="page">
、		<hx-navbar ref="hxnb" :config="config" />
		
		<view class="main-content">
			<view class="listPage">
				
			<!-- 	<view class="gaojigongneng1"> 
					<view class="oneItem">
						<view @click="clearLocalData()">清除本地数据</view>
					</view>
			
				</view> -->
				
				<view class="guanyu">
					<view class="oneItem"  @click="exit()">
						<view>退出账号</view>
<!-- 						<view style="margin-right: 40rpx;color: #77787b;">></view>
 -->					</view>
					<view class="oneItem" @click="zhuxiaozhanghao()">
						<view >注销账号</view>
<!-- 						<view style="margin-right: 40rpx;color: #77787b;">></view>
 -->					</view>
				 <!--  <view class="oneItem" @click="yinsixieyi()">
						<view >隐私协议</view>
						<view style="margin-right: 40rpx;color: #77787b;">></view>
					</view>
					<view class="oneItem" @click="guanyu()">
						<view >关于</view>
						<view style="margin-right: 40rpx;color: #77787b;">></view>
					</view> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import common from "@/common/common.js"
	
	export default {
		data() {
			return {
				config:{
					title: '用户设置',
				    backgroundColor: [1,['#a9a1ff','#6970ff']],
					}
			}
		},
		methods: {
			clearLocalData(){
				common.clearAllLocalData()
			},
			zhuxiaozhanghao(){
				var {userId} = common.getLoginState()
				var userActionLog = {
					actionType:'click',
					objectType:'wode.logout-',
					username: userId,
					createTime: new Date()
				}
				common.insertUserActionLog(userActionLog)
				
				uni.showModal({
					title: '注销账号',
					content: '确定要注销吗?',
					success: (res) => {
						if (res.confirm) {
							//console.log('用户点击确定');
							var loginState= common.getLoginState();
							this.isLogined=false
							loginState.isLogin = false
							loginState.isVip = false
							loginState.userName = '登录/注册'
							loginState.phoneNumber=''
							common.updateLoginState(loginState);
							common.deleteToken()
							this.yunduanSync = false
							common.updateUserProfile('syncToCloud',this.yunduanSync);
							this.clearLocalData()
							uni.navigateBack();
						} else if (res.cancel) {
							//console.log('用户点击取消');
						}
					}
				});
			},
			exit(){
				var {userId} = common.getLoginState()
				var userActionLog = {
					actionType:'click',
					objectType:'wode.logout-',
					username: userId,
					createTime: new Date()
				}
				common.insertUserActionLog(userActionLog)
				
				uni.showModal({
					title: '退出登录',
					content: '确定要退出登录吗?',
					success: (res) => {
						if (res.confirm) {
							//console.log('用户点击确定');
							var loginState= common.getLoginState();
							this.isLogined=false
							loginState.isLogin = false
							loginState.isVip = false
							loginState.userName = '登录/注册'
							loginState.phoneNumber=''
							common.updateLoginState(loginState);
							common.deleteToken()
							this.yunduanSync = false
							common.updateUserProfile('syncToCloud',this.yunduanSync);
							this.clearLocalData()
							uni.navigateBack();
						} else if (res.cancel) {
							//console.log('用户点击取消');
						}
					}
				});
			}
		}
	}
</script>

<style>
	@import url("/static/fonts/iconfont.css");
	@import url("/static/fonts/iconfont-weapp-icon.css");
	.page {
			width: 100%;
			height: 100%;
		}
		
	.main-content {
		top: 0rpx;
		bottom: 106rpx;
		left: 0;
		display: flex;
		flex-direction: column;
		width: 100%;
		background-color: #FFFFFF;			
	}
	
	.listPage{
		width: 100%;
		height: 80%;
		background-color: #F7F7F7;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content:flex-start
	}

	
	.kaitonghuiyuanback{
		width: 100%;
		height: 10%;
		background-image: linear-gradient(to bottom,#5a79ff 50%, #F7F7F7 0);
		align-items:center;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.kaitonghuiyuan{
		display: flex;
		flex-direction: row;
		height: 100rpx;
		justify-content: space-between;
		align-items:center;
		border-radius: 25rpx;
		width: 92%;
		background-color: #293047;
	}


	.gaojigongneng1{
		display: flex;
		flex-direction: column;
		background-color: #FFFFFF;
		/* height:480rpx; */
		height:120rpx;
		
		justify-content: space-around;
		align-items:flex-start;
		border-radius: 25rpx;
		width: 92%;
		margin-top: 30rpx;
	}
	.guanyu{
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items:flex-start;
		background-color: #FFFFFF;
/* 		height:480rpx;**/
		height:240rpx;
    	border-radius: 25rpx;
		width: 92%;
		margin-top: 30rpx;
	}
	.oneItem{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 50rpx;
		margin-left: 30rpx;
		width: 92%;
	}
</style>
