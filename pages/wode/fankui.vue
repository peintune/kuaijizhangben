<template>
	<view class="root">
		<hx-navbar ref="hxnb" :config="config" />
		
		<view class="page">
			<view class="first-row">
				<view class="title">反馈内容:</view>
				<view class="textarea">
					<textarea placeholder="请输入反馈内容"  v-model="fankuineirong" focus="true" auto-focus="true" 	/>
				</view>
				
			</view>
			<view class="first-row">
				<view class="title"> 联系方式:</view>
				<input class="lianxi" v-model="lianxifangshi" placeholder="请输入联系方式" />
			</view>
			<view class="first-row">
				<view class="confirm" @click="confirm()">提交</view>
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
					title: '提交反馈',
				    backgroundColor: [1,['#a9a1ff','#6970ff']]			
					},
				fankuineirong:'',
				lianxifangshi:''
			}
		},
		methods: {
			confirm(){
				
				var {userId} = common.getLoginState()
				var userActionLog = {
					actionType:'insert',
					objectType:'fankui.confirm-',
					username: userId,
					createTime: new Date()
				}
				common.insertUserActionLog(userActionLog)
				
				 if (this.fankuineirong == 'undefined' || !this.fankuineirong || !/[^\s]/.test(this.fankuineirong)) {
				        //为空
						uni.showToast({
						  title: `反馈内容不能为空`,
						   icon:'none',
						   duration: 1500
						})
						return;
				  } 
				var {userId} = common.getLoginState()
				uni.request({
					url: common.apiHost +'/api/feedback',
					method: 'POST',
					header:{
						'Content-Type' : 'application/json',
						Authorization: common.getToken()
					},
					data:{
						'type':'jizhang',
						'data':this.fankuineirong,
						'contact':this.lianxifangshi,
						'userId':userId,
					},
					timeout: 5000,
					fail :(res) =>{
						console.log(res)
						uni.showToast({
						  title: `提交失败`,
						   duration: 2000
						})
					},
					success: (res) => {
						if (res.data?.success) {							
							uni.showToast({
							  title: `感谢您的反馈`,
							   icon:'none',
							   duration: 2000,
							   success: function (res) {
							   		uni.navigateBack();
							   	}
							})
							
						} else{
							uni.showToast({
							  title: `提交失败`,
							   duration: 2000
							})
						}
					}
					})
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
		background-color: #FFFFFF;
	}
	
	.page {
		background-color: #FFFFFF;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-direction: column;
	}
	.first-row{
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		width: 92%;
		margin-top: 50rpx;
	}
	.title{
		width: 30%;
	}
	.textarea{
		margin-left: 10rpx;
		background-color: #F7F7F7;
		width: 70%;
	}
	.lianxi{
		margin-left: 10rpx;
		background-color: #F7F7F7;
		width: 70%;
	}
	.confirm{
		margin-top: 300rpx;
		margin-bottom: 10rpx;
		width: 60%;
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
