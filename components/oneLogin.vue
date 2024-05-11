<template>
</template>

<script>
	import common from "@/common/common.js"
	export default {
		name: "oneLogin",
		data() {
			return {
				aLiSDKModule:null,
				authUiConfig:{
					uiConfig:{
						setSwitchHidden: "true",
						setNavHidden: "false", 
						setCheckboxHidden: "false",
					    setSloganHidden: "false",
						setStatusBarColor: "#5a79ff", //状态栏背景颜色
						setNavUi:{
							 bgColor:'#5a79ff',
							 text: "登录/注册", 
							 textColor: "#FFFFFF",
						},
						  //第一个自定义协议内容配置（最多支持添加3个自定义协议）
						setAppPrivacyOne: {
							title: "《用户政策》", //协议标题
							url: "http://xxxxxxx.com/yonghuzhengce.html" //协议链接
						},
						setAppPrivacyTwo: {
							title: "《隐私政策》", //协议标题
							url: "http://xxxxxxx.com/yinsixieyi.html" //协议链接
						},
						 //设置协议详情页导航栏相关
						setWebNavUi: {
							bgColor:"#5a79ff", //协议详情页的导航栏背景色
							textColor: "#FFFFFF", //协议详情页的导航栏标题颜色
							textSize: "15", //协议详情页的导航栏标题大小，注意后面不要加单位，默认单位为sp
						},
					}
				}
			}
		},
		onLoad() {
			this.aLiSDKModule = uni.requireNativePlugin('AliCloud-NirvanaPns')
			var androidAliyunAuth = "xxxxxxxxxx";
			var iosAliyunAuth=""
			this.aLiSDKModule.setAuthSDKInfo(androidAliyunAuth)
		},
		onShow() {
			this.aLiSDKModule.accelerateLoginPage(3000, result => {
				if ("600000" == result.resultCode) {
					//console.log("加速成功")
				}
			})
		},
		methods: {	
			openOneLoginPage(){		
				uni.getNetworkType({
					success: res => {
						//console.log(res)//网络类型 wifi、2g、3g、4g、ethernet、unknown、none
						if (res.networkType === 'none') {
							uni.showModal({
								title: '系统提示',
								content: '当前无网络，无法登录,请打开移动网络（非wifi）',
								showCancel: false,
								success: res => {
									if (res.confirm) {}}
							});
						} else {
							
						}}
				 });
				
				this.aLiSDKModule = uni.requireNativePlugin('AliCloud-NirvanaPns')
				var androidAliyunAuth = "xxxxxx";
				var iosAliyunAuth=""
				
				this.aLiSDKModule.getCurrentCarrierName(carrierName => {
				    console.log("当前运营商为：" + carrierName)
				})
				this.aLiSDKModule.setAuthSDKInfo(androidAliyunAuth)
				// this.aLiSDKModule.accelerateLoginPage(3000, result => {					
				// 	if ("600000" == result.resultCode) {
				// 		//console.log("加速成功")
				// 	}
				// })	
				 this.aLiSDKModule.getLoginToken(
				    5000,
				    this.authUiConfig,
				    tokenResult => {
						console.log(tokenResult.resultCode)
						
				        if ("600001" == tokenResult.resultCode) {
				            console.log("授权页拉起成功")
				        } else if ("600000" == tokenResult.resultCode) {
							var oneLoginToken = tokenResult.token;
							if(oneLoginToken){
								//登录 or 注册
								uni.request({
									url: common.apiHost +'/api/sso/auth',
									method: 'POST',
									data:{
										token:oneLoginToken
									},
									timeout: 5000,
									header: {
									    'content-type': 'application/x-www-form-urlencoded',
										Authorization: common.getToken()
									},									
									fail :(res) =>{
										console.log(res)
									},
									success: (res) => {
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
												timeout: 3000,	
											    fail :(res) =>{
													console.log("failed user profile:" + res)
											    },
												header:{
													Authorization: common.getToken()
												},
												success: (res) => {
													if(res.data.success){
														common.saveUserProfile(res.data.data)
														
													}else{
													}
												}
											})
										}
										common.updateLoginState(loginState)
									}
								});
							}
				            this.aLiSDKModule.quitLoginPage()
				        } else {							
				            //其他失败情况，手动关闭授权页
				            //this.aLiSDKModule.quitLoginPage()
				        }
				    },
				    clickResult => {
						var {userId} = common.getLoginState()
						var userActionLog = {
							actionType:'update',
							objectType:'onLogin.open',
							username: userId,
							createTime: new Date()
						}
						common.insertUserActionLog(userActionLog)
						
				        switch (clickResult.resultCode) {
				            case "700000":
				                console.log("用户点击返回按钮")
				                break
				            case "700001":
				                console.log("用户切换其他登录方式")
				                break
				            case "700002":
				                console.log("用户点击登录按钮")
				                break
				            case "700003":
				                console.log("用户点击checkBox")
				                break
				            case "700004":
				                console.log("用户点击协议")
				                break
				        }
				    },
				    customUiResult => {
				        //这里回调的是自定义控件的点击事件，通过 customUiResult.widgetId 来识别自定义控件，然后做一些自己的处理
				    }
				)
			}
		}
			
	}
</script>

<style>
</style>
