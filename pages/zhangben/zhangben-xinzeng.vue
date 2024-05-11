<template>
	<view class="root">
		<hx-navbar ref="hxnb" :config="config" />
		
		<view class="page">
				<view class="first-row">
					<view>账本名称：</view>
					<input focus="true" type="text"  v-model="zhengbenname" maxlength="10" placeholder="请输入账本名字" />
				</view>
				
				<view class="color-select">
					<view class="blue-color" :class="['0',selectNum== 0?'xuanzhong':'']" @click="tabclick(0)"></view>
					<view class="white-color" :class="['0',selectNum== 1?'xuanzhong':'']" @click="tabclick(1)"></view>
					<view class="zise-color" :class="['0',selectNum== 2?'xuanzhong':'']" @click="tabclick(2)"></view>
					<view class="green-color" :class="['0',selectNum== 3?'xuanzhong':'']" @click="tabclick(3)"></view>
					<view class="red-color" :class="['0',selectNum== 4?'xuanzhong':'']" @click="tabclick(4)"></view>
					<view class="yellow-color" :class="['0',selectNum== 5?'xuanzhong':'']" @click="tabclick(5)"></view>
					<view class="zhuganhong-color" :class="['0',selectNum== 6?'xuanzhong':'']" @click="tabclick(6)"></view>
					<view class="zhonghuang-color" :class="['0',selectNum== 7?'xuanzhong':'']" @click="tabclick(7)"></view>
					<view class="gray-color" :class="['0',selectNum== 8?'xuanzhong':'']" @click="tabclick(8)"></view>
					<view class="shenlv-color" :class="['0',selectNum== 9?'xuanzhong':'']" @click="tabclick(9)"></view>
				</view>
				
				<!-- <view class="user-insert-line"></view> -->
				
				<view class="confirm" @click="confirm()">确认</view>
		</view>
	</view>
</template>

<script>
	import common from "@/common/common.js"

	export default {
		data() {
			return {
				config:{ 
					title: '新增账本',
                    backgroundColor: [1,['#a9a1ff','#6970ff']]			
					},
				selectNum: 0,
				zhangbenNum: '1',
				zhengbenname: '',
				zhangbencolor:'#5a79ff',
				zhangben:{}
			}
		},
		onLoad:function(options){
			//onload 可以带页面参数进来，如果有值，说明是编辑账本
			if(!options.pageParam){
				return;
			}
			
			this.config.title = '编辑账本'
			var zhangbenNum = options.pageParam;
			var zhangben = {};
			try {
				const cacheMap = common.getZhangbenCache()
				if (cacheMap) {
					zhangben = cacheMap[zhangbenNum];
				}else{
					return;
				}
			} catch (e) {
				console.log(e);
			};	
			
			this.zhangbencolor = zhangben.color;
			this.zhengbenname = zhangben.name;
			this.zhangbenNum = zhangben.number;
			this.selectNum = zhangben.colorNum;
			this.zhangben={
				number:zhangben.number,
				name:zhangben.name,
				createTime: zhangben.createTime,
				updateTime: zhangben.updateTime,
				type:zhangben.type,
				shouru: zhangben.shouru,
				zhichu: zhangben.zhichu,
				count: zhangben.count,
				creator: zhangben.creator,
				participant: zhangben.participant,
				color:zhangben.color,
				colorNum: this.selectNum
			}	
		},
		methods: {
			tabclick(number) {
				this.selectNum = number;
				if(number == 0){
					this.zhangben.color = '#5a79ff';
					this.zhangbencolor = '#5a79ff';
					return;
				}
				
				if(number == 1){
					this.zhangben.color = '#a9a1ff';
					this.zhangbencolor = '#a9a1ff';
					return;
				}
				
				if(number == 2){
					this.zhangben.color = '#795DA3';
					this.zhangbencolor = '#795DA3';
					return;
				}
				
				if(number == 3){
					this.zhangben.color = '#4CD964';
					this.zhangbencolor = '#4CD964';
					return;
				}
				
				if(number == 4){
					this.zhangben.color = '#BD2C00';
					this.zhangbencolor = '#BD2C00';
					return;
				}
				
				if(number ==5){
					this.zhangben.color = '#D66F08';
					this.zhangbencolor = '#D66F08';
					return;
				}
				
				if(number == 6){
					this.zhangben.color = '#53261f';
					this.zhangbencolor = '#53261f';
					return;
				}
				
				if(number == 7){
					this.zhangben.color = '#ffe600';
					this.zhangbencolor = '#ffe600';
					return;
				}
				
				if(number == 8){
					this.zhangben.color = '#708090';
					this.zhangbencolor = '#708090';
					return;
				}
				if(number == 9){
					this.zhangben.color = '#181d4b';
					this.zhangbencolor = '#181d4b';
					return;
				}
				
			},		
			confirm(){
				var {userId} = common.getLoginState()
				var userActionLog = {
					actionType:'insert',
					objectType:'zhangben.xinzen-',
					username: userId,
					createTime: new Date()
				}
				common.insertUserActionLog(userActionLog)
				
				
				 if (this.zhengbenname == 'undefined' || !this.zhengbenname || !/[^\s]/.test(this.zhengbenname)) {
				        //为空
						uni.showToast({
						  title: `账本名称不能为空`,
						   icon:'none',
						   duration: 1500
						})
						return;
				  } 
	            var timestamp = Date.parse(new Date());
				if(!this.zhangbenNum || this.zhangbenNum==1 ){
					this.zhangbenNum = timestamp;
				}		
				var zhangbenMapCache = {}
				try {
					const cacheMap = common.getZhangbenCache()
					if (cacheMap) {
						zhangbenMapCache = cacheMap;
					}
				} catch (e) {
					console.log(e);
				};				
				var oldZhangben = zhangbenMapCache[this.zhangbenNum];		
				var oneItem ={};			
				if (oldZhangben){
					oneItem ={
							number:this.zhangbenNum,
							name: this.zhengbenname,
							createTime: oldZhangben.createTime,
							updateTime: timestamp,
							type:oldZhangben.type,
							shouru: oldZhangben.shouru,
							zhichu: oldZhangben.zhichu,
							count: oldZhangben.count,
							creator:oldZhangben.creator,
							participant:oldZhangben.participant,
							color:this.zhangbencolor,
							colorNum: this.selectNum
					}
				}else{
					oneItem ={
							number:this.zhangbenNum,
							name: this.zhengbenname,
							createTime: timestamp,
							updateTime: timestamp,
							type:'(自定义)',
							shouru: 0.00,
							zhichu: 0.00,
							count: 0,
							creator:'未登录',
							participant:'我',
							color:this.zhangbencolor,
							colorNum: this.selectNum
					}
				}
				zhangbenMapCache[this.zhangbenNum] = oneItem;
				common.updateZhangbenCache(zhangbenMapCache)
				var {userId} = common.getLoginState()
				common.addChangedData('zhangben',false,userId,oneItem)
				this.zhengbenname = '';
				this.selectNum=0;
				this.zhangbencolor='#5a79ff';
				this.zhangbenNum = '1';
				uni.navigateBack();
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
	
	.user-insert-line {
		margin-top: 50rpx;
		margin-bottom: 30rpx;
		height: 3px;
		width: 70%;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #1B1B1B;
	}
	
	.first-row{
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		width: 92%;
		margin-top: 50rpx;
		margin-left: 50rpx;
		margin-right: 10rpx;
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
	
	.xuanzhong{
		border-style:double;
		border-width: 15rpx;
		border-color: #FFFFFF;
	}
	
	.color-select{
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: row;
		padding: 10rpx;
		margin-top: 40rpx;
		flex-wrap: wrap;
	}
	
	.red-color{
		width: 60rpx;
		height: 60rpx;
		background-color: #BD2C00;
		border-radius: 60rpx;
		margin: 40rpx;
	}
	
	.blue-color{
		width: 60rpx;
		height: 60rpx;
		background-color: #5a79ff;
		border-radius: 60rpx;
		margin: 40rpx;
		
	}
	
	.white-color{
		width: 60rpx;
		height: 60rpx;
		background-color: #a9a1ff;
		border-radius: 60rpx;
		margin: 40rpx;
		
	}
	.green-color{
		width: 60rpx;
		height: 60rpx;
		background-color: #4CD964;
		border-radius: 60rpx;
		margin: 40rpx;
		
	}
	
	.zise-color{
		width: 60rpx;
		height: 60rpx;
		background-color: #795DA3;
		border-radius: 60rpx;
		margin: 40rpx;
		
	}
	
	.gray-color{
		width: 60rpx;
		height: 60rpx;
		background-color: #708090;
		border-radius: 60rpx;
		margin: 40rpx;
		
	}
	
	.yellow-color{
		width: 60rpx;
		height: 60rpx;
		background-color: #D66F08;
		border-radius: 60rpx;
		margin: 40rpx;
		
	}
	
	.shenlv-color{
		width: 60rpx;
		height: 60rpx;
		background-color: #181d4b;
		border-radius: 60rpx;
		margin: 40rpx;
		
	}
	
	.zhuganhong-color{
		width: 60rpx;
		height: 60rpx;
		background-color: #53261f;
		border-radius: 60rpx;
		margin: 40rpx;
		
	}
	
	.zhonghuang-color{
		width: 60rpx;
		height: 60rpx;
		background-color: #ffe600;
		border-radius: 60rpx;
		margin: 40rpx;
		
	}
</style>
