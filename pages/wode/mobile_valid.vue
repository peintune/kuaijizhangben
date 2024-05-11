<template>
	<view class="root">
		<hx-navbar ref="hxnb" :config="config" />

		<view class="page">
				<view class="first-row">
					<view style="width: 30%;">验证码</view>
					<input class="yanzhengm" focus="true" type="tel"  v-model="yanzhengma" maxlength="4"  />
				</view>
				
				<view class="confirm" @click="confirm()">点击验证</view>
		</view>
	</view>
</template>

<script>
	import common from "@/common/common.js"
	import sliderVerify from '@/components/slider-verify/slider-verify.vue';

	export default {
		data() {
			return {
				config:{ 
					title: '短信验证',
                    backgroundColor: [1,['#a9a1ff','#6970ff']]			
					},
				yanzhengma:'',
				phoneNumber:'',

			}
		},
		onLoad:function(options){
			//onload 可以带页面参数进来，如果有值，说明是编辑账本
			this.phoneNumber = options.phoneNumber;
		},
		methods: {	
			confirm(){
				uni.showLoading({
					title:"验证中...",
					mask:true	
				})
				if (this.phoneNumber && this.phoneNumber.length==11 && this.yanzhengma && this.yanzhengma.length==4){
					// 调用接口验证短信验证码
					//登录 or 注册
					uni.request({
						url: common.apiHost +'/api/sms/verify?phoneNumber='+this.phoneNumber+ '&sms='+this.yanzhengma,
						method: 'POST',
						header:{
							'Content-Type' : 'application/json',
							Authorization: common.getToken()
						},
						timeout: 30000,
						fail :(res) =>{
							uni.hideLoading()
							uni.showToast({
							  title: `验证失败，请检查网络`,
							  icon:'error',
							  duration: 2000
							})
						},
						success: (res) => {
							if (res.data?.success) {
								var loginState = {
									"isLogin":false,
									"isVip":false,
									"loginTime":new Date()
								}
								
								if(res.data.success){
									loginState.isLogin=true
									loginState.loginTime = new Date()
									loginState.phoneNumber=res.data.data.phoneNumber
									loginState.userName=res.data.data.userNameAlias
									loginState.userId=res.data.data.username
									loginState.isVip=res.data.data.isVip
									common.updateToken(res.data.data.jwtToken)
									
									uni.request({
										url: common.apiHost + '/api/profile?userName='+loginState.userId,
										method: 'GET',
										timeout: 10000,	
									    fail :(res) =>{
											console.log("failed user profile:" + res)
									    },
										header:{
											Authorization: common.getToken()
										},
										success: (res) => {
											uni.hideLoading()
											if(res.data.success){
												common.saveUserProfile(res.data.data)
											}else{
											}
										}
									})
								}
								common.updateLoginState(loginState)
							} else{
								uni.showToast({
								  title: `验证失败，请重新发送`,
								  icon:'error',
								   duration: 2000
								})
							}
						}
					})
				}else{
					uni.showToast({
						title: '验证码不合法',
						duration: 2500
					});
				}
			}
		}
	}
</script>

<style>
	.root{
		width: 100%;
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	
	.page {
		background-color: #FFFFFF;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-direction: column;
		height: 100%;
	}
	
	
	.first-row{
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		width: 80%;
		margin-top: 150rpx;
	}
	.yanzhengm{
		align-items: center;
		text-align: center;
		background-color: #DCDCDC;
		border-radius: 20rpx;
		font-size: 60rpx;
		letter-spacing: 40rpx;
		width: 90%;
	}
	.confirm{
		margin-top: 100rpx;
		margin-bottom: 10rpx;
		width: 90%;
		color: #FFFFFF;
		background-image: linear-gradient(to bottom right, #5a79ff, #7392ff);
		border-radius: 20rpx;
		height: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: bold;
	}
	
		
</style>
