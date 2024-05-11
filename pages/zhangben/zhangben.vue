<template>
	<view class="root">
		<hx-navbar ref="hxnb" :config="config" @clickBtn="addZhangben"/>
		<oneLogin ref="oneLogin"></oneLogin>
		
		<view class="page">
			<view style="font-size: 20rpx;"> 提示：只有非系统账本才能加入其他人一起记账 </view>
			<scroll-view class="zhangben-list"  show-scrollbar="false" scroll-y="true" >
					<view   v-for="(item2,index2) in zhangben" :key='index2'>				
						<view class="zhangben-item"
						 :style="{'border-style':'double','border-color': item2.color}" >
							<view class="fistColumn" @click="chooseZhangben(item2.number)">
								<view class="first-row">
									<view class="title">
										<view style="font-size: 30rpx; font-weight: bold;color: #768fff;"
										:style="{color: item2.color}"
										>{{item2.name}}</view>
										<view style="font-size: 20rpx;">{{item2.type}}</view>
									</view>		
									<view  v-if="item2.number==currentZhanbenNumber" style="font-size: 35rpx;color: #768fff; font-weight: blod">当前账本</view>
								</view>
								
								<!-- <view class="sencond-row">
									<view style="font-size: 30rpx;">总记账数: {{item2.count}}</view>
								</view>
								<view class="sencond-row">
									<view style="font-size: 25rpx;">总支出: {{item2.zhichu}}</view>
									<view class="splitclass">|</view>
									<view style="font-size: 25rpx;">总收入: {{item2.shouru}}</view>	
								</view> -->
								<view class="sencond-row">
									<view style="font-size: 20rpx;">创建者: {{item2.creator}}</view>
									<view style="font-size: 20rpx;">参与者: {{item2.participant}}</view>
								</view>
							</view>
							<view class="user-insert-line"></view>
							<view class="scondColumn">					
								<view class="operation"	v-if="item2.number!='1'" >
									<view class="edit icon iconfont icon-bianji" @click="editZhangben(item2.number)"></view>
									<view class="edit icon iconfont icon-guanbi" @click="deleteZhangben(item2.number)"></view>
								</view>	
							</view>
						</view>	
						
					</view>	
					
					<view class="operatorArea">
						<view class="addZhanghuBt" @click="addZhangben()">
							<view class="addZhanghuIcon">+</view>
							<view>添加账本</view>
						</view>
					</view>
				</scroll-view>
		</view>
	</view>
</template>

<script>
	import common from "@/common/common.js"
	import oneLogin from '../../components/oneLogin.vue'

	export default {
		components: {
			oneLogin
		},
		data() {
			return {
				config:{ 
					title: '账本管理',
                    backgroundColor: [1,['#a9a1ff','#6970ff']],
					},
				currentZhanbenNumber: '1',
				zhangben:{}
			}
		},
		onShow() {
			//缓存中 获取当前账本
			const cacheZhangbenNumber= common.getCurrentZhanbenNumber()
			this.currentZhanbenNumber = cacheZhangbenNumber;
			
			//缓存中获取所有账本
			var zhangbenMapCache = {}
			try {
				const cacheMap = common.getZhangbenCache()
				if (cacheMap) {
					zhangbenMapCache = cacheMap;	
					this.zhangben = zhangbenMapCache;
					return;
				}
			} catch (e) {
				console.log(e);
			};	
		},
		methods: {
			 addZhangben(data){
				 var loginState= common.getLoginState()
				 var isLogin=false;
				 var isVip = false;
				 if(loginState){
				 	isLogin = loginState.isLogin || false
					isVip = loginState.isVip || false
				 }
				 
				 if (!isLogin){
					 uni.showToast({
					   title: `请先登录`,
					    icon:'none',
					    duration: 1500
					 })
					// this.$refs.oneLogin.openOneLoginPage();
					return
				 }else{
					 const cacheMap = common.getZhangbenCache()
					 if (cacheMap && Object.keys(cacheMap).length >=2) {
						 if(!isVip){
							 //TODO 请求后端接口判断是否是vip
							 uni.showToast({
							   title: `非会员只能创建2个账本，请先开通会员`,
							    icon:'none',
							    duration: 2000
							 })
							 return
						 }
					 }
					 uni.navigateTo({
					 	url:  '/pages/zhangben/zhangben-xinzeng'
					 })
				 }
			 },
			editZhangben(number){
				var {userId} = common.getLoginState()
				var userActionLog = {
					actionType:'update',
					objectType:'zhangben-'+number,
					username: userId,
					createTime: new Date()
				}
				common.insertUserActionLog(userActionLog)
				
				
				var {isLogin}= common.getLoginState()
				if(!isLogin){
					//this.$refs.oneLogin.openOneLoginPage();
					uni.showToast({
						title:"请先登录",
						mask:true,
						duration:2000,
					})
					return
				}
				uni.navigateTo({
					url:  '/pages/zhangben/zhangben-xinzeng?pageParam='+number
				})
			},
			deleteZhangben(number){
				var {userId} = common.getLoginState()
				var userActionLog = {
					actionType:'delete',
					objectType:'zhangben-'+number,
					username: userId,
					createTime: new Date()
				}
				common.insertUserActionLog(userActionLog)
				
				var {isLogin}= common.getLoginState()
				if(!isLogin){
					uni.showToast({
						title:"请先登录",
						mask:true,
						duration:2000,
					})
					//this.$refs.oneLogin.openOneLoginPage();
					return
				}
				uni.showModal({
				　　　　　　　　title: '删除账本',
				　　　　　　　　content: '确认要删除该账本吗?',
				　　　　　　　　success:async function(res) {
				　　　　　　　　　　if (res.confirm) {		  																
										var zhangbenMapCache = {}
										try {
											const cacheMap = common.getZhangbenCache()
											if (cacheMap) {
												zhangbenMapCache = cacheMap;
											}
										} catch (e) {
											console.log(e);
										};		
										
										var oldZhangben = zhangbenMapCache[number];	
										if(oldZhangben && oldZhangben.count !=0){
											uni.showToast({
											  title: `该账本记录不为空，不能删除。`,
											   icon:'none',
											   duration: 2000
											})
											return;
										}
										var {userId} = common.getLoginState()
										common.addChangedData('zhangben',true,userId,oldZhangben)
										delete zhangbenMapCache[number];
										common.updateZhangbenCache(zhangbenMapCache)
										this.currentZhanbenNumber = "1";
										common.updateCurrentZhanbenNumber("1")
										uni.reLaunch({
											url:  '/pages/zhangdan/zhangdan'
										})																											
				　　　　　　　　} else if (res.cancel) {
				　　　　　　　　　　console.log('用户点击取消')
				　　　　　　　　}
				　　　　　　}
				　　　　});
			},
			chooseZhangben(number){
				var {userId} = common.getLoginState()
				var userActionLog = {
					actionType:'swich',
					objectType:'zhangben-'+number,
					username: userId,
					createTime: new Date()
				}
				common.insertUserActionLog(userActionLog)
				
				this.currentZhanbenNumber = number;
				common.updateCurrentZhanbenNumber(number)
				uni.reLaunch({
					url:  '/pages/zhangdan/zhangdan'
				})
			}
		}
	}
</script>

<style>
	@import url("/static/fonts/iconfont.css");
	@import url("/static/fonts/iconfont-weapp-icon.css");
	
	.root{
		height: 100%;
	}
	
	.page {
		background-color: #F7F7F7;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		height: 100%;
	}
	
	.user-insert-line {
		height: 80%;
		border-style:dotted;
		border-color: #000000;
		content: '';
		margin-left: 30rpx;
		-webkit-transform: scaleX(.2);
		transform: scaleX(.2);
		background-color: #d4d5d8;
	}
	
	.zhangben-list {
		width: 92%;
		margin-left: 4%;
		margin-right: 4%;
		background-color: #F7F7F7;
		height: 100%;	
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.zhangben-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content:flex-start;
		background-color: #FFFFFF;
		margin-bottom: 15rpx;
		margin-top: 30rpx;
		height: 350rpx;
		border-radius: 30rpx;
		align-items:center;
	}
	
	.fistColumn{
		display: flex;
		flex-direction: column;
		justify-content:flex-start;
		align-items: center;
		width: 70%;
	}
	
	.scondColumn{
		width: 20%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
	}
	
	.first-row{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: 92%;
		margin-top: 20rpx;
		margin-left: 20rpx;
		margin-right: 10rpx;
	}
	
	.title{
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.edit{
		display: flex;
		flex-direction: row;	
		align-items: center;
		width: 120rpx;
		height: 100%;
		font-size: 40rpx;
		justify-content: center;
		margin-left: 30rpx;
	}
	
	.operation{
		display: flex;
		flex-direction: column;	
		align-items: center;
		height: 90%;
	}
	
	.sencond-row{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: 92%;
		margin-top: 40rpx;
		margin-left: 20rpx;
		margin-right: 10rpx;
	}
	
	.operatorArea{
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
	}
	.addZhanghuBt{
		margin-top: 50rpx;
		margin-bottom: 150rpx;
		width: 70%;
		color: #FFFFFF;
		background-image: linear-gradient(to bottom right, #5a79ff, #7392ff);
		border-radius: 20rpx;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.addZhanghuIcon{
		margin-right: 20rpx;
		font-size: 50rpx;
	}
</style>
