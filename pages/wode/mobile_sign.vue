<template>
	<view class="root">
		<hx-navbar ref="hxnb" :config="config" />
		<slider-verify :isShow="sliderVerifyFLag" @touchSliderResult="verifyResult" ref="verifyElement"></slider-verify>

		<view class="page">
				<view class="first-row">
					<view>+86</view>
					<input class="shoujihaom" focus="true" type="tel"  v-model="phoneNumber" maxlength="11" placeholder="请输入手机号码" />
				</view>
				
				<view class="confirm" @click="confirm()">获取短信验证码</view>
		        <view class="xieyi">
					<checkbox-group @change="handleChange">
						<label>
							<checkbox value="checked" style="transform:scale(0.7);"/>
						</label>
					</checkbox-group>

					<view class="neirong">
						<view>我已阅读并同意</view>
						<a href="http://xxxxx.com/yonghuzhengce.html">《用户政策》</a>
						<view>和</view>
						<a href="http://xxxxx.com/yinsixieyi.html">《隐私政策》</a>
					</view>
				</view>
		</view>
	</view>
</template>

<script>
	import common from "@/common/common.js"
	import sliderVerify from '@/components/slider-verify/slider-verify.vue';

	export default {
		components: {
		        'slider-verify': sliderVerify
		    },
		data() {
			return {
				config:{ 
					title: '手机号登录/注册',
                    backgroundColor: [1,['#a9a1ff','#6970ff']]			
					},
				phoneNumber:'',
				sliderVerifyFLag: false ,//滑块验证
				verifySuccess:false,
				checkboxvalue:'',
			}
		},
		onLoad:function(options){
		},
		methods: {
			
			confirm(){
				//uni.navigateBack();
				if (this.checkboxvalue != "checked"){
					uni.showToast({
						title: '请先同意协议',
						duration: 2500
					});
					return;
				}
				
				if (this.phoneNumber && this.phoneNumber.length==11 && this.phoneNumber.startsWith("1")){
					this.sliderVerifyFLag = true
				}else{
					uni.showToast({
						title: '手机号不合法',
						duration: 2500
					});
					return;
				}
			},
			handleChange(e) {
					this.checkboxvalue = e.detail.value.join(';');	
				},
			verifyResult(res) {
			            this.sliderVerifyFLag = false;
			            if (res) {  //校验通过
							this.verifySuccess = true	
							// 调用接口发送短信验证码
							// uni.showLoading({
							// 	title: '短信验证码发送中...',
							// 	mask:true
							// });
							uni.request({
								url: common.apiHost +'/api/sms/login/send?phoneNumber='+this.phoneNumber,
								method: 'POST',
								header:{
									'Content-Type' : 'application/json',
									Authorization: common.getToken()
								},
								timeout: 30000,
								fail :(res) =>{
									console.log(res)
									//uni.hideLoading();
									uni.showToast({
									  title: `验证码发送失败`,
									  icon:'error',
									   duration: 2000
									})
								},
								success: (res) => {
									//uni.hideLoading();
									if (res.data?.success) {
										// uni.showToast({
										//   title: `验证码已发送`,
										//   duration: 2000,
										//   icon:'none',
										//   success() {
										// 	//跳转到验证页面
										// 	// uni.navigateTo({
										// 	// 	url:  '/pages/wode/mobile_valid?phoneNumber='+this.phoneNumber
										// 	// })	
									 //    	}
										// })
										
									} else{
										console.log(res)
										uni.showToast({
										  title: `验证码发送失败`,
										  icon:'error',
										   duration: 2000
										})
									}
								}
							})
							uni.navigateTo({
								url:  '/pages/wode/mobile_valid?phoneNumber='+this.phoneNumber
							})	
			            }else{
							this.verifySuccess = false
			                // 校验失败,点击关闭按钮
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
		width: 92%;
		margin-top: 150rpx;
		margin-left: 50rpx;
		margin-right: 10rpx;
	}
	
	.shoujihaom{
		align-items: center;
		text-align: center;
		width: 80%;
		background-color: #DCDCDC;
		border-radius: 10rpx;
		margin-left: 20rpx;
		height: 70rpx;
		font-size: 55rpx;
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
	
	.xieyi{
		margin-top: 500rpx;
		margin-bottom: 10rpx;
		display: flex;
		flex-direction: row;
		width: 90%;
		height: 60rpx;
		justify-content: center;
		align-items: center;
		
	}
		
	.neirong{
		display: flex;
		flex-direction: row;
		margin-left: 3rpx;
		font-size: 20rpx;
		width: 100%;
		height: 60rpx;
		justify-content: flex-start;
		align-items: center;
	}
</style>
