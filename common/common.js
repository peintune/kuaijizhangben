export default {
	
	version: '1.0',
	apiHost: 'http://服务端主域名.com',
	//apiHost:'http://192.168.1.9:9028',
	
	getVersion: function(){
		return uni.getStorageSync("version")
	},
	updateVersion: function(version){
		return uni.setStorageSync("version",version)
	},
	
	getToken: function(){
		return uni.getStorageSync("token")
	},
	updateToken: function(token){
		return uni.setStorageSync("token",token)
	},
	deleteToken: function(){
		return uni.removeStorageSync("token")
	},
	getLoginState: function(){
		return uni.getStorageSync("loginState")
	},
	updateLoginState: function(loginState){
		uni.$emit('loginStateChanged', loginState);
		return uni.setStorageSync("loginState",loginState)
	},
	deleteLoginState: function(){
		return uni.removeStorageSync("loginState")
	},
	getZhangbenCache: function(){
		return uni.getStorageSync("zhangbenCache")
	},
	updateZhangbenCache: function(zhangbenCache){
		return uni.setStorageSync("zhangbenCache",zhangbenCache)
	},
	deleteZhangbenCache: function(){
		return uni.removeStorageSync("zhangbenCache")
	},
	getZhanghuCache: function(){
		return uni.getStorageSync("zhanghuCache")
	},
	updateZhanghuCache: function(zhanghuCache){
		var result = uni.setStorageSync("zhanghuCache",zhanghuCache)
		uni.$emit('zhanghuUpdate');
		return result
	},
	deleteZhanghuCache: function(){
		var result = uni.removeStorageSync("zhanghuCache")
		uni.$emit('zhanghuDelete');
		return result
	},
	getDataCache: function(){
		return uni.getStorageSync("dataCache")
	},
	updateDataCache: function(dataCache){
		return uni.setStorageSync("dataCache",dataCache)
	},
	deleteDataCache: function(){
		return uni.removeStorageSync("dataCache")
	},
	getCurrentZhanbenNumber: function(){
		return uni.getStorageSync("currentZhanbenNumber")
	},
	updateCurrentZhanbenNumber: function(currentZhanbenNumber){
		return uni.setStorageSync("currentZhanbenNumber",currentZhanbenNumber)
	},
	deleteCurrentZhanbenNumber: function(){
		return uni.removeStorageSync("currentZhanbenNumber")
	},
	getChangedData: function(){
		return uni.getStorageSync("changedData")
	},
	addChangedData: function(type, isDelete,creator, changedData){
		var changeDataCache  = this.getChangedData();
		if(!changeDataCache){
			changeDataCache =  []
		}
		changeDataCache.push({
			type:type,
			isDelete: isDelete,
			creator:creator,
			data:changedData
		})
		return uni.setStorageSync("changedData",changeDataCache)
	},
	deleteChangedData: function(){
		return uni.removeStorageSync("changedData")
	},
	getUserProfile: function(key){
		var userProfile= uni.getStorageSync("userProfile")
		if ( !userProfile || userProfile === undefined || userProfile=="" ){
			return null
		}
		return userProfile[key]
	},
	updateUserProfile: function(key, value){
		var userProfile= uni.getStorageSync("userProfile")
		if ( !userProfile || userProfile === undefined || userProfile=="" ){
			 userProfile = {}
		}
		userProfile[key] = value
		return uni.setStorageSync("userProfile",userProfile)
	},
	saveUserProfile: function(userProfile){
		return uni.setStorageSync("userProfile",userProfile)
	},
	getDownloadStatus: function(){
		return uni.getStorageSync("downloadStatus")
	},
	updateDownloadStatus: function(downloadStatus){
		return uni.setStorageSync("downloadStatus",downloadStatus)
	},
	insertUserActionLog: function(userActionLog){
		var userActionLogCache= uni.getStorageSync("userActionLog")
		if ( !userActionLogCache || userActionLogCache === undefined || userActionLogCache=="" ){
			 userActionLogCache = []
		}
		userActionLogCache.push(userActionLog)
		return uni.setStorageSync("userActionLog",userActionLogCache)
	},
	getUserActionLog: function(){
		return uni.getStorageSync("userActionLog")
	},
	deleteUserActionLog: function(){
		return uni.removeStorageSync("userActionLog")
	},
	clearAllLocalData: function(){
		uni.removeStorageSync("userActionLog")
		uni.removeStorageSync("downloadStatus")
		uni.removeStorageSync("changedData")
		uni.removeStorageSync("dataCache")
		uni.removeStorageSync("zhanghuCache")
		uni.removeStorageSync("zhangbenCache")
		uni.removeStorageSync("zhangbenCache")
		
	},
}