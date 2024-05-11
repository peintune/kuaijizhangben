
<script>
	import common from "@/common/common.js"

	export default {
		data(){
			return{
				uploadTimer: null,
				downloadTimer: null,
				zhangbenDownloadSuscess:false,
				zhanghuDownloadSuscess:false,
				zhangdanDownloadSuscess:false,
				
			}
		},
		onLaunch: function() {
			console.log('App Launch');
			
			//隐藏系统导航条
			uni.hideTabBar({
                animation: false
            })	
			//预加载页面
			// uni.preloadPage({url: "/pages/zhangdan/zhangdan"});
			// uni.preloadPage({url: "/pages/tongji/tongji"});
			// uni.preloadPage({url: "/pages/zhanghu/zhanghu"});
			// uni.preloadPage({url: "/pages/wode/wode"});
			
			//初始化登录态
			this.initLoginData();
			//设置系统账本
			this.initZhangbenData();
			//设置默认的账户、资产数据
			this.initZhanghuData();
			this.initUserProfile();
			//新增、删除记账记录触发整体数据更新
			uni.$on('dataInsert', this.onzhangdanDataInsert)
			uni.$on('dataDelete', this.onzhangdanDataDelete)
			uni.$on('dataUpdate', this.onzhangdanDataUpdate)
			uni.$on("loginStateChanged",this.loginStateChanged)
			
			this.checkUpgrade()
			
		},
		onShow: function() {
			console.log('App Show')			
		//预加载页面
			uni.preloadPage({url: "/components/jizhang"});
			uni.preloadPage({url: "/components/tab"});
			//uni.preloadPage({url: "/pages/zhangdan/zhangdan"});
			uni.preloadPage({url: "/pages/tongji/tongji"});
			uni.preloadPage({url: "/pages/zhanghu/zhanghu"});
			uni.preloadPage({url: "/pages/zhanghu/zhanghu-xinzeng"});
			uni.preloadPage({url: "/pages/zhanghu/zhangben"});
			uni.preloadPage({url: "/pages/zhanghu/zhangben-xinzeng"});
			uni.preloadPage({url: "/pages/wode/wode"});	
			//定时上传更改的数据到后端
			let that = this
		    this.uploadTimer = setInterval(function () {
						that.uploadChangeData()
					}, 3000);
			this.downloadTimer = setInterval(function () {
						that.downloadCloudData(false)
					}, 5000);
			this.userActionLogTimer = setInterval(function () {
						that.uploadUserActionLogs()
					}, 5000);
		},
		onHide: function() {
			console.log('App Hide')
			
			//取消定时器
			if(this.uploadTimer) {  
			   clearInterval(this.uploadTimer);
			   this.uploadTimer = null;
			}
			if(this.downloadTimer) {
			    clearInterval(this.downloadTimer);
			    this.downloadTimer = null;
			 } 
			if(this.userActionLogTimer) {
			     clearInterval(this.userActionLogTimer);
			     this.userActionLogTimer = null;
			  } 
		},
		methods:{
			checkUpgrade(){
				
				var clientVersion = common.getVersion()
				if(!clientVersion){
					var clientVersion = common.version
				}
				
				uni.request({
					url: common.apiHost + '/checkUpgrade?appName=kuaijz&clientVersion='+clientVersion,
					method: 'GET',
					timeout: 3000,	
				    fail :(res) =>{
						console.log("failed user profile:" + res)
				    },
					header:{
						Authorization: common.getToken()
					},
					success: (res) => {
						console.log(res)
						if(res.data.success){
							var newVersion = res.data.data.version
							var content = res.data.data.updateDetail
							var downloadUrl = res.data.data.downloadUrl
							if(res.data.data.needUpgrade){
								try{
									
									uni.showModal({
										title: '应用升级:'+newVersion,
										// content: content,
										 showCancel	:false,
										success: function (res) {
											if (res.confirm) {
												console.log('开始升级2');
												//#ifdef APP-PLUS
												plus.runtime.openURL(downloadUrl);
												//#endif
												//common.updateVersion(newVersion)
											} 
										}
									});
								}catch(e){
									console.log(e)
								}	
							}else{
								
							}
						}
					}
				})
			},
			initLoginData(){
				var loginState = common.getLoginState()
				console.log(loginState)
				if(loginState && loginState.isLogin){
					var jwtToken = common.getToken()
					if (!jwtToken){
						loginState = {
							"isLogin":false,
							"isVip":false,
							"loginTime":new Date()
						}
						common.updateLoginState(loginState)
					}else{
						uni.request({
							url: common.apiHost + '/api/verify?jwtToken='+jwtToken,
							method: 'POST',
							timeout: 3000,	
							header:{
								Authorization: common.getToken()
							},
						    fail :(res) =>{
								console.log("failed call login:" + res)
						    },
							success: (res) => {
								console.log(res.data);
								if(!res.data.success){
									loginState = {
										"isLogin":false,
										"isVip":false,
										"loginTime":new Date()
									}
								}else{
								}
							}
						});
					}
				}else{
					loginState = {
						"isLogin":false,
						"isVip":false,
						"loginTime":new Date()
					}
				}
				common.updateLoginState(loginState)
				if (!loginState.isLogin){
					common.deleteToken()
				}
			},
			initUserProfile(){
				var loginState = common.getLoginState()
				if(loginState && loginState.isLogin){
					uni.request({
						url: common.apiHost + '/api/user?userName='+loginState.userId,
						method: 'GET',
						timeout: 3000,	
						header:{
							Authorization: common.getToken()
						},
					    fail :(res) =>{
							console.log("failed user profile:" + res)
					    },
						success: (res) => {
							console.log(res.data);
							if(res.data.success){
								common.saveUserProfile(res.data.data)
							}else{
							}
						}
					});
				}
			},
			initZhangbenData(){
				//缓存设置默认当前账本
				const cacheZhangbenNumber = common.getCurrentZhanbenNumber()
				if(!cacheZhangbenNumber){
					common.updateCurrentZhanbenNumber('1')
				}
							
				//缓存中设置默认账本
				var zhangbenMapCache = {}
				try {
				    const cacheMap = common.getZhangbenCache()
					if (!cacheMap) {
					var timestamp = Date.parse(new Date());
					var oneItem ={
							number:'1',
							name: '默认账本',
							createTime: timestamp,
							updateTime: timestamp,
							type:'(系统默认)',
							shouru: 0.00,
							zhichu: 0.00,
							count: 0,
							creator: '系统',
							participant:'我',
							color:'#5a79ff'
					};
					
					zhangbenMapCache['1'] = oneItem;
					common.updateZhangbenCache(zhangbenMapCache)
					common.addChangedData('zhangben',false,null, oneItem)
					}
				} catch (e) {
					console.log(e);
				};	
			},
			initZhanghuData(){
				//缓存中设置默认账户
				try {
					const zhanghuCache= common.getZhanghuCache()
					if(!zhanghuCache){
						const defaultZhanghuCache={
							0:
							[{
								"number":1,
								"templateId":1,
								"icon":"t-icon-_xianjin",
								"name":"现金",
								"type":"现金",
								"category":0,
								"count":0,
								"describe":"系统创建"
							}],
							1: [{ 
								"number":2,
								"templateId":2,
								"icon":"t-icon-zhifubao1",
								"name":"支付宝",
								"type":"在线支付",
								"category":1,
								"count":0,
								"describe":"系统创建"
							},{
								"number":3,
								"templateId":3,
								"icon":"t-icon-weixin1",
								"name":"微信",
								"type":"在线支付",
								"category":1,
								"count":0,
								"describe":"系统创建"
							}],
							2:[{
								"number":4,
								"templateId":4,
								"icon":"t-icon-jiechu",
								"name":"借出",
								"type":"债务",
								"category":2,
								"count":0,
								"describe":"系统创建"
							},
							{
								"number":5,
								"templateId":5,
								"icon":"t-icon-zu-copy",
								"name":"借入",
								"type":"债务",
								"category":2,
								"count":0,
								"describe":"系统创建"
							}],
						};
						common.updateZhanghuCache(defaultZhanghuCache)
						// for (var key in defaultZhanghuCache){
						// 	for (var item of defaultZhanghuCache[key]){
						// 		common.addChangedData('zhanghu',false,null,item)
						// 	}
						// }
					}
				} catch (e) {
					console.log(e);
				};	
			},
			async uploadUserActionLogs(){
				var userActionLogCache = common.getUserActionLog()
				//console.log(userActionLogCache)
				if (userActionLogCache && userActionLogCache.length >0){
					for(var i =0; i< userActionLogCache.length; i++){
						console.log(userActionLogCache.length)
						try{
							var success = await this.uploadUserActionLog(userActionLogCache[i])
						}catch(e){
							console.log(e)
						}
					}	
					common.deleteUserActionLog()
				}
			},
			async uploadChangeData(){
				//登录状态 并且 打开了同步才同步数据
				var {isLogin,userId} = common.getLoginState()				
				if(!isLogin){
					return
				}
				var syncToCloud = common.getUserProfile('syncToCloud')				
				if (!syncToCloud){
					return
				}
				
				var successCount = 0
				var changeData = common.getChangedData()
				
				if (changeData){
				    console.log('start upload job start')
					console.log(changeData)
					var upLoadSuccess = true
					for (var i =0;i< changeData.length ; i++){
						var {type,isDelete,data} = changeData[i]
						if (isDelete){
							data['isDeleted'] = true
						}
						data['creator'] = userId
						var success = await this.uploadDataToCloud(type, data)
						if (!success){
							upLoadSuccess = false
						}
					}	
						
					if (upLoadSuccess){
						common.deleteChangedData()
					}
				}
			},
			async loginStateChanged(loginState){
				console.log('login changed')
				console.log(loginState)
				if (!loginState.isLogin) {
					return
				}
				
				if(this.downloadTimer) {
				    clearInterval(this.downloadTimer);
				    this.downloadTimer = null;
				 } 
				 
				var userId = loginState.userId
				var changeData = common.getChangedData()
				if (changeData){
					var upLoadSuccess = true;
					for (var i=0; i< changeData.length; i++ ) {
						var value = changeData[i]
						var {type,isDelete,data} = value
						if (isDelete){
							data['isDeleted'] = true
						}	
						data['creator'] = userId
						var success = await this.uploadDataToCloud(type, data)
						if (!success){
							upLoadSuccess = false
						}
					}
					if (upLoadSuccess){
						common.deleteChangedData()
					}
				}
				
				uni.showLoading({
					title: '云端数据下载中...',
					mask:true
				});
				
			  common.updateDownloadStatus(false)
			  
			  
			  var success = await this.downloadCloudData(true)	
			  
			  this.sleep(1000)
			  setTimeout(function(){
			  	uni.hideLoading()
				uni.reLaunch({
						url:  '/pages/zhanghu/zhanghu'
					})
			  }, 1000);
			  
			  if(!success){
				  let that = this
				  this.downloadTimer = setInterval(function () {
				  			that.downloadCloudData(false)
				  		}, 20000);
				
			  }	else{
				  uni.reLaunch({
				  		url:  '/pages/zhanghu/zhanghu'
				  	})
			  }	  
			},
		    sleep (time) {
			  return new Promise((resolve) => setTimeout(resolve, time));
			},
			async downloadCloudData(force){
				var {isLogin,userId} = common.getLoginState()
				if(!isLogin){
					return
				}
				if (!force){
					var downloadSuccess = common.getDownloadStatus()
					console.log('download job '+ downloadSuccess )
					if (downloadSuccess){
						return
					}else{
						common.updateDownloadStatus(false)
					}
				}
				
				//下载最新云端数据
				await this.downloadZhangben()
				await this.downloadZhanghu()
				await this.downloadZhangdan()
				
				if (this.zhangbenDownloadSuscess && this.zhanghuDownloadSuscess && this.zhangdanDownloadSuscess){
					common.updateDownloadStatus(true)
					return true
				}
				return false
			},
			async downloadZhangben(){
				var {userId} = common.getLoginState()
				this.zhangbenDownloadSuscess = false
				try{
					uni.request({
						url: common.apiHost + '/api/zhangben/list?creator='+ userId,
						method: 'GET',
						timeout: 5000,	
						header: {Authorization: common.getToken()},
					    fail :(res) =>{
							console.log("failed for request:" + res)
					    },
						success: (res) => {
							if(res.data.success){
								console.log("zhangben")
								console.log(res.data.data)
								var zhangbenCache = {}
								if (res.data.data){
									res.data.data.forEach(item => {
										zhangbenCache[item.number] = item
									})
									//删除本地缓存数据
									common.deleteZhangbenCache()
									common.updateZhangbenCache(zhangbenCache)
								}
								this.zhangbenDownloadSuscess = true
							}else{
							}
						}
					})
				}catch(e){
					this.zhangbenDownloadSuscess = false
				}
			},
			async downloadZhanghu(){
				var {userId} = common.getLoginState()
				this.zhanghuDownloadSuscess = false
				try{
					uni.request({
						url: common.apiHost + '/api/zhanghu/list?creator='+ userId,
						method: 'GET',
						timeout: 5000,	
						header: {Authorization: common.getToken()},
					    fail :(res) =>{
							console.log("failed for request:" + res)
					    },
						success: (res) => {
							if(res.data.success){
								console.log("zhanghu")
								console.log(res.data.data)
								var zhanghuCache = {}
								if (res.data.data){
									res.data.data.forEach(item => {
										if(!zhanghuCache[item.category]){
											zhanghuCache[item.category] = []
										}
										zhanghuCache[item.category].push(item)
									})
									//删除本地缓存数据
									common.deleteZhanghuCache()
									common.updateZhanghuCache(zhanghuCache)
								}
								this.zhanghuDownloadSuscess = true
							}else{
							}
						}
					})
				}catch(e){
					console.log(e)
					this.zhanghuDownloadSuscess = false
				}
			
			},
			uploadUserActionLog(data){
				return new Promise((resolve, reject)=>{
					uni.request({
						url: common.apiHost +'/api/user/action',
						method: 'POST',
						header:{
							'Content-Type' : 'application/json',
							Authorization: common.getToken()
						},
						data:data,
						timeout: 5000,
						fail :(res) =>{
							console.log('failed to upload actionlog data')
							console.log(res)
							reject(res)
						},
						success: (res) => {
							console.log(res)
							
							if(res.data.success){
								resolve(true)
							}else{
								resolve(false)
							}
						}
						})
				})
			},
		    uploadDataToCloud(type,data){
				return new Promise((resolve, reject)=>{
					uni.request({
						url: common.apiHost +'/api/'+type,
						method: 'POST',
						header:{
							'Content-Type' : 'application/json',
							Authorization: common.getToken()
						},
						data:data,
						timeout: 5000,
						fail :(res) =>{
							console.log('failed to upload data')
							console.log(res)
							reject(res)
						},
						success: (res) => {
							if(res.data.success){
								resolve(true)
							}else{
								resolve(false)
							}
						}
						})
				})
			},
			searchZhangdanData(userId, pageNumber, pageSize ){
				return new Promise((resolve,reject)=>{
					uni.request({
						url: common.apiHost + '/api/zhangdan/query?isDeleted=false&creator='+ userId+'&pageSize='+pageSize+'&pageNumber='+pageNumber,
						method: 'GET',
						timeout: 5000,	
						header: {Authorization: common.getToken()},
					    fail :(res) =>{
							console.log("failed for request:" + res)
							reject(res)
					    },
						success: (res) => {
							resolve(res.data)				
						}
					})
				})
			},
			async downloadZhangdan(){
				var {userId} = common.getLoginState()
				this.zhangdanDownloadSuscess = false
				var isFinished = false;
				var zhangdanCache = {}
				try{
					for (var i =0; i< 300;i++){
						if (isFinished) break
						var data = await this.searchZhangdanData(userId,i,100)
						console.log(data)
						
						if (data){
							if (!data.success){
								console.log("download zhangdan failed")
								return
							}
							
							if (data.data.length < 100) {
								isFinished =true
							}
							data.data.forEach(item => {
								console.log(item)
								if(!zhangdanCache[item.zhangbenNum]){
									zhangdanCache[item.zhangbenNum] = {}
								}
								
								if (!zhangdanCache[item.zhangbenNum][item.date]){
									zhangdanCache[item.zhangbenNum][item.date] = {}
									zhangdanCache[item.zhangbenNum][item.date]['data']=[]
									zhangdanCache[item.zhangbenNum][item.date]['zhichu'] = parseFloat('0')
									zhangdanCache[item.zhangbenNum][item.date]['shouru'] = parseFloat('0')
								}
								console.log(zhangdanCache[item.zhangbenNum][item.date])
								
								if(item.inv == 0){
									var old = zhangdanCache[item.zhangbenNum][item.date]['zhichu']
									zhangdanCache[item.zhangbenNum][item.date]['zhichu'] = parseFloat(old) - parseFloat(item.count)		
								}else if(item.inv ==1){
									var old = zhangdanCache[item.zhangbenNum][item.date]['shouru']
									zhangdanCache[item.zhangbenNum][item.date]['shouru'] = parseFloat(old) + parseFloat(item.count)	
								}
								zhangdanCache[item.zhangbenNum][item.date]['data'].push(item)
							})
						}else{
							console.log("download zhangdan failed")
							return
						}
					}
					//删除本地缓存数据
				common.deleteDataCache()
				common.updateDataCache(zhangdanCache)
				console.log('donwloand success')
				console.log(zhangdanCache)
				this.zhangdanDownloadSuscess = true
				}catch(e){
					console.log(e)
					this.zhangdanDownloadSuscess = false
				}
			},
			onzhangdanDataInsert(e) {
				var oneItem = e;				
				//账户统计
				try {
					var {userId} = common.getLoginState()
					const zhanghuMapCache = common.getZhanghuCache()
					if (zhanghuMapCache) {
						const currentZhanghuCategoryList = zhanghuMapCache[oneItem.zhanghuCategory];	
						for(const zhanghuItem of currentZhanghuCategoryList){
							if (oneItem.zhanghuNum == zhanghuItem.number){
								zhanghuItem.count = parseFloat(zhanghuItem.count) + parseFloat(oneItem.count);
								common.addChangedData('zhanghu',false,userId,zhanghuItem)
								break;
							}
						}
						common.updateZhanghuCache(zhanghuMapCache)						
					}
					common.addChangedData('zhangdan',false,userId,oneItem)		
				} catch (e) {
					console.log(e);
				};	
			},
			onzhangdanDataDelete(e) {
				var oneItem = e;
				//账户统计
				try {
					const zhanghuMapCache = common.getZhanghuCache()
					var {userId} = common.getLoginState()
					if (zhanghuMapCache) {
						const currentZhanghuCategoryList = zhanghuMapCache[oneItem.zhanghuCategory];	
						for(const zhanghuItem of currentZhanghuCategoryList){
							if (oneItem.zhanghuNum == zhanghuItem.number){
								zhanghuItem.count = parseFloat(zhanghuItem.count) - parseFloat(oneItem.count)
								common.addChangedData('zhanghu',false,userId,zhanghuItem)	
							}
						}
						common.updateZhanghuCache(zhanghuMapCache)
					}
					common.addChangedData('zhangdan',true,userId,oneItem)
				} catch (e) {
					console.log(e);
				};	
			},
			onzhangdanDataUpdate(e){
				var {oldItem,oneItem} = e;	
				//账户统计
				try {
					const zhanghuMapCache = common.getZhanghuCache()
					var {userId} = common.getLoginState()
					if (zhanghuMapCache) {
						//更新旧的
						const oldZhanghuCategoryList = zhanghuMapCache[oldItem.zhanghuCategory];
						for(const zhanghuItem of oldZhanghuCategoryList){
							if (oldItem.zhanghuNum == zhanghuItem.number){
								zhanghuItem.count = parseFloat(zhanghuItem.count) - parseFloat(oldItem.count)
								common.addChangedData('zhanghu',false,userId,zhanghuItem)
							}
						}						
						
						//更新新的
						const currentZhanghuCategoryList = zhanghuMapCache[oneItem.zhanghuCategory];	
						for(const zhanghuItem of currentZhanghuCategoryList){
							if (oneItem.zhanghuNum == zhanghuItem.number){
								zhanghuItem.count = parseFloat(zhanghuItem.count) + parseFloat(oneItem.count)
								common.addChangedData('zhanghu',false,userId,zhanghuItem)
							}
						}
						common.updateZhanghuCache(zhanghuMapCache)
					}
					common.addChangedData('zhangdan',false,userId,oneItem)	
				} catch (e) {
					console.log(e);
				};	
			}
		}
	}
</script>

<style>

</style>
