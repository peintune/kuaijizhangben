<template>
	<view class="page">
		<tab ref="tab"></tab>
		<oneLogin ref="oneLogin"></oneLogin>
			
		<view class="main-content">
			<view class="total-card">
				<view class="title">
					资产账户管理
				</view>
				<view class="jingzican">
					<view style="font-size: 30rpx;">净资产</view>
					<view style="font-size: 50rpx;">{{jingzican}}</view>
				</view>
				<view class="zican">
					<view class="zican-item">
						<view>总资产</view>
						<view>{{zongzican}}</view>
					</view>
					<view class="splitclass">|</view>
				
					<view class="zican-item">
						<view>负债</view>
						<view>{{fuzai}}</view>
					</view>
				</view>
				
			</view>
			<view class="listPage">
				<scroll-view class="list"  show-scrollbar="false" scroll-y="true" 
				         refresher-background="#F7F7F7">
					<view class="one-zhanghu-group" v-for="(item,index) in zhanghuData" :key='index'>
						<view class="category">{{item[0].type}}</view>
						<view class="one-zhanghu" v-for="(item2,index2) in item" :key='index2' @click="editZhanghu(item2.category,item2.type,item2.templateId,item2.number)">
							<view class="categoryIcon" :class="[item2.icon]" ></view>
							<view class="name-and-describe">
								<view class="categoryText">{{item2.name}}</view>
								<view class="beizhuText">{{item2.describe}}</view>
							</view>
							<view class="count">{{item2.count}}</view>
						</view>				
					</view>
					
					<view class="operatorArea">
						<view class="addZhanghuBt" @click="onClickBtn()">
							<view class="addZhanghuIcon">+</view>
							<view>添加资产账户</view>
						</view>
					</view>			
				</scroll-view>		
			</view>		
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
				zhanghuData:{},
				jingzican:'0.00',
				zongzican:'0.00',
				fuzai:'0.00'
			}
		},
		onLoad() {
			uni.$on('zhanghuUpdate', this.onzhanghuUpdate);
			uni.$on('zhanghuDelete', this.onzhanghuUpdate);
		},
		onShow() {
			this.$nextTick(function(){
				this.$refs.tab.setNumber(2);
			});
			//隐藏系统导航条
			uni.hideTabBar({
			    animation: false
			})	
			this.getZhanghuCache();	
		},
		onHide() {
			this.$nextTick(function(){
				this.$refs.tab.setNumber(5);
			})		
		},
		methods: {
			getZhanghuCache(){
				//获取所有的账本
				const zhanghuCache= common.getZhanghuCache()
				this.zongzican = '0.00';
				this.jingzican='0.00';
				this.fuzai='0.00';
				
				for(var zhanghukey in zhanghuCache){
					var zhanghuCategoryArray = zhanghuCache[zhanghukey];
					if (zhanghuCategoryArray.length >0){
						this.zhanghuData[zhanghukey] = zhanghuCategoryArray;
						for(var zhanghu of zhanghuCategoryArray ){
							this.zongzican = parseFloat(this.zongzican) +  parseFloat(zhanghu.count);
							if(zhanghu.category==2 && zhanghu.templateId==5){
								this.fuzai = parseFloat(this.fuzai) + parseFloat(zhanghu.count);
							}
						}
					}
				}
				
				this.jingzican = this.zongzican - this.fuzai;
			},
			onzhanghuUpdate(){
				this.getZhanghuCache();
			},
			onClickBtn(){
				var {userId} = common.getLoginState()
				var userActionLog = {
					actionType:'insert',
					objectType:'zhanghu-',
					username: userId,
					createTime: new Date()
				}
				common.insertUserActionLog(userActionLog)
				
				
				var loginState= common.getLoginState()
				var isLogin=false;
				var isVip=false
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
					//this.$refs.oneLogin.openOneLoginPage();	
					 return
				}else{
					var zhanghuCount = 0
					 const zhanghuCache = common.getZhanghuCache()
					 for(var zhanghukey in zhanghuCache){
					 	var zhanghuCategoryArray = zhanghuCache[zhanghukey];
						zhanghuCount = zhanghuCount + zhanghuCategoryArray.length
					}
					 
					 if (zhanghuCache && zhanghuCount >=6) {
						 if(!isVip){
							 //TODO 请求后端接口判断是否是vip
							 uni.showToast({
							   title: `非会员只能创建6个账户，请先开通会员`,
								icon:'none',
								duration: 2000
							 })
							 return
						 }
					 }
					uni.navigateTo({
						url:  '/pages/zhanghu/zhanghu-xinzeng'
					})
				}	
			},
			editZhanghu(category,type,templateId,number){
				var {userId} = common.getLoginState()
				var userActionLog = {
					actionType:'update',
					objectType:'zhanghu-'+number,
					username: userId,
					createTime: new Date()
				}
				common.insertUserActionLog(userActionLog)
				
				var {isLogin}= common.getLoginState()
				if(!isLogin){
					uni.showToast({
						title:"请先登录",
						mask:true,
						icon:'none',
						duration:2000,
					})
					//this.$refs.oneLogin.openOneLoginPage();
					return
				}
				
				uni.navigateTo({
					url:  '/pages/zhanghu/zhanghu-xinzeng?pageParam='+category+','+type+','+templateId+','+number
				})
			},
			onPulling(){
				var that = this;
				if(!this.triggered){
					this.triggered = true;
					setTimeout(function() {
						that.triggered = false
					}, 500);
				}
			},
			onRefresh(){
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
		 	height: 30%;
			display: flex;
			flex-direction: column;
			align-items: center;
			background-image: linear-gradient(to bottom, #5a79ff, #7790ff);
		}
		.title{
			font-size: 45rpx;		
			margin-top: 60rpx;
			color: #000000;
			font-weight: bold;
		}
		
		.jingzican{
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-top: 40rpx;
			color: #FFFFFF;
		}
		
		.zican{
			width: 80%;
			margin-top: 30rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}
		
		.zican-item{
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 25rpx;
			color: #FFFFFF;
		}
		
		.splitclass {
			color: #414142;
		}
		
		.listPage{
			width: 100%;
			height: 70%;
			background-color: #F7F7F7;	
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}
		
		.list{
			width: 92%;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
		}
		
		.one-zhanghu-group{
			display: flex;
			flex-direction: column;
			width: 100%;
		}
		
		.category{
			color: #888888;
			font-size: 25rpx;
			margin-top: 20rpx;
		}
		
		.one-zhanghu{
			display: flex;
			flex-direction: row;
			background-color: #FFFFFF;
			height: 120rpx;
			justify-content: space-between;
			align-items:center;
			margin-bottom: 15rpx;
			margin-top: 10rpx;
			border-radius: 25rpx;
		}
		
		.categoryIcon {
			/* background-color: #7790ff; */
			/* border-radius: 60rpx; */
			padding: 10rpx;
			width: 50rpx;
			height: 50rpx;
			margin-left: 15rpx;
			margin-right: 15rpx;
			margin-top: 15rpx;
			font-family: "iconfont" !important;
			font-size: 60rpx;
			text-align: center;
/* 			font-style: normal;
 */			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
			/* color: #FFFFFF;
			font-weight: bold; */
			align-content: normal;
		}
		
		.categoryText {
			font-size: 30rpx;
		}
		
		.beizhuText {
			font-size: 25rpx;
			margin-top: 10rpx;
			overflow: hidden;
			color: #888888;
			text-overflow:ellipsis;
			display:-webkit-box-orient;
			white-space:nowrap;
			line-clamp: 1;
			-webkit-lin-clamp:1;
			-webkit-box-orient: vertical;
			word-break: break-all;
		}
		
		.name-and-describe{
			display: flex;
			flex-direction: column;
			width: 50%;
			align-items:flex-start;
		}
		.count{
			width: 30%;
			margin-right: 20rpx;
			font-size: 35rpx;
			text-align: end;
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
