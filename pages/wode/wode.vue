<template>
	<view class="page">
		<tab ref="tab"></tab>	
		<oneLogin ref="oneLogin"></oneLogin>
		<view class="main-content">
			<view class="total-card">
				<view class ="user">
					<view v-show="isLogined==false"  class="user-name" @click="openOneLoginPage()">
						登录/注册   >
					</view>
					<view class="user22">
						<view class="userIcon" v-show="isLogined==true" @click="toUserSetting()">
							<view v-show="isLogined==true" class="icon iconfont icon-shuimu" style="font-size: 60rpx; "></view>
						</view>
						<view v-show="isLogined==true" class="user-name" @click="toUserSetting()">
							{{userName}}
						</view>
					</view>
					
					<view style="margin-right: 30rpx;font-size: 50rpx;" v-show="isLogined==true" @click="toUserSetting()">
						>
					</view>
				</view>
			
			</view>
			<view class="listPage">
				<view class="kaitonghuiyuanback">
					<!-- <view class="kaitonghuiyuan">
						<view class="kaitonghuiyuanword">
							<view style="font-size: 30rpx; color: #deab8a;">升级到专业版</view>
							<view style="font-size: 20rpx; color: #deab8a;">解锁更多高级功能</view>
						</view>
						<view class="jiesuoButton">
							<view style="font-size: 30rpx; color: #deab8a;">立即解锁</view>	
						</view>
					</view> -->
				</view>
				
				
				<view class="gaojigongneng1"> 
					<view class="oneItem">
						<view>云端同步</view>
						<view >
							<zero-switch  v-model="yunduanSync" :stopChange="true" @change="onYunduantongbuChange"></zero-switch>
						</view>
					</view>
				<!-- 	<view class="oneItem" @click="dengdaikaifang('daochu')">
						<view >导出数据</view>
						<view style="margin-right: 40rpx;color: #77787b;">></view>
					</view>
					<view class="oneItem" @click="dengdaikaifang('mima')">
						<view>隐私密码</view>
						<view style="margin-right: 40rpx;color: #77787b;">></view>
					</view>
					<view class="oneItem" @click="dengdaikaifang('fenlei')">
						<view>自定义分类</view>
						<view style="margin-right: 40rpx;color: #77787b;">></view>
					</view> -->
				</view>
				
				<view class="guanyu">
					<view class="oneItem"  @click="fankui()">
						<view>反馈</view>
						<view style="margin-right: 40rpx;color: #77787b;">></view>
					</view>
					<!-- <view class="oneItem" @click="dengdaikaifang('pingfen')">
						<view >评分</view>
						<view style="margin-right: 40rpx;color: #77787b;">></view>
					</view>
					<view class="oneItem" @click="dengdaikaifang('fenxiang')">
						<view >分享</view>
						<view style="margin-right: 40rpx;color: #77787b;">></view>
					</view> -->
					<view class="oneItem" @click="yonghuxieyi()">
						<view >用户协议</view>
						<view style="margin-right: 40rpx;color: #77787b;">></view>
					</view>
				   <view class="oneItem" @click="yinsixieyi()">
						<view >隐私协议</view>
						<view style="margin-right: 40rpx;color: #77787b;">></view>
					</view>
					<view class="oneItem" @click="guanyu()">
						<view >关于</view>
						<view style="margin-right: 40rpx;color: #77787b;">></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import common from "@/common/common.js"
	import oneLogin from '@/components/oneLogin.vue'
	
	export default {
		components: {
			oneLogin
		},
		data() {
			return {
				isLogined:false,
			    aLiSDKModule:null,
				phoneNumber:"",
				userName: "登录/注册",
				yunduanSync : "true",
			}
		},
		onShow() {
			this.$nextTick(function(){
				this.$refs.tab.setNumber(3);
			})
			//隐藏系统导航条
			uni.hideTabBar({
			    animation: false
			})
			
			var loginState= common.getLoginState()
			if(loginState){
				this.isLogined = loginState.isLogin || false
				this.isVip = loginState.isVip || false
				this.userName = this.isLogined?loginState.userName || "登录/注册":"登录/注册"
				this.phoneNumber = loginState.phoneNumber
			}
			this.initUserProfile()
		},
		onHide() {
			this.$nextTick(function(){
				this.$refs.tab.setNumber(5);
			})		
		},
		onLoad() {
			 uni.$on("loginStateChanged",this.loginStateChanged)
		},
		methods: {
			dengdaikaifang(type){
				var {userId} = common.getLoginState()
				var userActionLog = {
					actionType:'click',
					objectType:'wode-'+type,
					username: userId,
					createTime: new Date()
				}
				common.insertUserActionLog(userActionLog)
				
				uni.showToast({
				  title: `努力开发中，很快上线，尽请期待`,
				   icon:'none',
				   duration: 1300
				})
			},
			toUserSetting() {
				 uni.navigateTo({
				 	url:  '/pages/wode/user_setting'
				 })	
			},
			yonghuxieyi(){
				uni.navigateTo({
					url:  '/pages/h5/yonghuzhengce'
				})	
			},
			yinsixieyi(){				
				uni.navigateTo({
					url:  '/pages/h5/yinsixieyi'
				})	
			},
			guanyu(){				
				uni.navigateTo({
					url:  '/pages/wode/guanyu'
				})	
			},
			initUserProfile(){
				var syncToCloud=common.getUserProfile('syncToCloud')
				if (syncToCloud){
					this.yunduanSync = syncToCloud
				}else{
					this.yunduanSync = false
				}
			},
			fankui(){
				uni.navigateTo({
					url:  '/pages/wode/fankui'
				})
				
			},
			onYunduantongbuChange(e){				
				var loginState = common.getLoginState();
			    this.yunduanSync = !this.yunduanSync
				if(this.yunduanSync && !this.isLogined){
					uni.showToast({
					  title: `请先登录`,
					   duration: 1800
					})
					this.yunduanSync =false
					return
				}else if(this.yunduanSync && this.isLogined){
					this.yunduanSync =true
				}else if (!this.btnAsync){
					this.yunduanSync =false
				}
				var userId = loginState.userId;
				this.yunduanSync = !this.yunduanSync
				if (!loginState || !userId){
					uni.showToast({
					  title: `请先登录`,
					   duration: 2000
					})
					return
				}
				
				let that = this
				if (this.yunduanSync){
				    uni.showModal({
						title: '关闭云端同步',
						content: '确定关闭同步吗？关闭后，本地数据可能丢失，请谨慎操作',
						success: function (res) {
							if (res.confirm) {
								uni.request({
									url: common.apiHost +'/api/profile',
									method: 'POST',
									header:{
										'Content-Type' : 'application/json',
										Authorization: common.getToken()
									},
									data:{
										'username':userId,
										'syncToCloud':!that.yunduanSync	,
									},
									timeout: 3000,
									fail :(res) =>{
										console.log(res)
										uni.showToast({
										  title: `开关失败，请检查网络`,
										   duration: 2000
										})
									},
									success: (res) => {
										if (res.data?.success) {
											that.yunduanSync = !that.yunduanSync
										} else{
											console.log("开关失败")
											console.log(res)
										}
									 common.updateUserProfile('syncToCloud',that.yunduanSync );
									}
									})
							} else if (res.cancel) {
								return
							}
						}
					});	
				}else{
					uni.request({
						url: common.apiHost +'/api/profile',
						method: 'POST',
						header:{'Content-Type' : 'application/json',
						 Authorization: common.getToken()
						 },
						data:{
							'username':userId,
							'syncToCloud':!that.yunduanSync	,
						},
						timeout: 3000,
						fail :(res) =>{
							console.log(res)
							uni.showToast({
							  title: `开关失败，请检查网络`,
							   duration: 2000
							})
						},
						success: (res) => {
							console.log(res)
							
							if (res.data?.success) {
								that.yunduanSync = !that.yunduanSync
							} else{
								console.log("开关失败")
								console.log(res)
							}
						 common.updateUserProfile('syncToCloud',that.yunduanSync );
						}
						})
				}
			},
			logout(){
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
						} else if (res.cancel) {
							//console.log('用户点击取消');
						}
					}
				});
			},
			loginStateChanged(loginState){
				if (loginState.isLogin){
					this.phoneNumber=loginState.phoneNumber
					this.userName=loginState.userName
					this.isLogined = true;
				}else{
					this.phoneNumber= null
					this. userName= '登录/注册'
					this.isLogined = false;
				}
			},
			openOneLoginPage(){	
				// var {userId} = common.getLoginState()
				// var userActionLog = {
				// 	actionType:'click',
				// 	objectType:'wode.login-',
				// 	username: userId,
				// 	createTime: new Date()
				// }
				// common.insertUserActionLog(userActionLog)
				uni.getNetworkType({
					success: res => {
						//console.log(res.networkType)//网络类型 wifi、2g、3g、4g、ethernet、unknown、none
						if (res.networkType === 'none') {
							uni.showModal({
								title: '系统提示',
								content: '当前无网络，无法登录,请打开网络',
								showCancel: false,
								success: res => {
									if (res.confirm) {}}
							});
						} else if (res.networkType === 'wifi' || res.networkType === 'ethernet'
						|| res.networkType === 'unknown') {
							//跳转到手机号注册页面
							uni.navigateTo({
								url:  '/pages/wode/mobile_sign'
							})	
						} else if (res.networkType.endsWith('g')) {
							this.$refs.oneLogin.openOneLoginPage();
						}else{
							uni.showModal({
								title: '系统提示',
								content: '当前无网络，无法登录,请打开网络',
								showCancel: false,
								success: res => {
									if (res.confirm) {}}
							});
						  }
						}
				 });
			},
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
		position: fixed;
		top: 0rpx;
		bottom: 106rpx;
		left: 0;
		display: flex;
		flex-direction: column;
		width: 100%;
		background-color: #FFFFFF;			
	}

	.total-card {
		margin-top: 0rpx;
		width: 100%;
		height: 20%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		background-color: #5a79ff;
/* 		background-image: linear-gradient(to bottom, #5a79ff, #7790ff);
 */	}
	
	.listPage{
		width: 100%;
		height: 80%;
		background-color: #F7F7F7;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content:flex-start
	}

	.user{
		margin-top: 150rpx;	
		margin-left: 60rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 90%;
	}
	
	.user22{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.userIcon{
		display: flex;
		justify-content: center;
		align-items:flex-start;
		width: 80rpx; 
		height: 80rpx; 
		border-radius: 10px;
		border: 1px solid white;
		background-color: #F7F7F7;
		margin-right: 30rpx;
	}
	
	.user-name{
		margin-left: 10rpx;
		font-size: 40rpx;	
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
	.kaitonghuiyuanword{
		display: flex;
		flex-direction: column;
		height: 70%;
		margin-left: 50rpx;
		align-items:flex-start;	
	}
	.jiesuoButton{
		background-color: #F7F7F7;
		border-radius: 15rpx;
		width: 25%;
		margin-right: 30rpx;
		align-items: center;
		text-align: center;
		height: 50rpx;
		display: flex;
		justify-content: center;
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
		height:480rpx;
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
