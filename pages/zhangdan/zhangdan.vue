<template>
	<view class="page">
		<tab ref="tab"></tab>
		<jizhang ref="jizhang"></jizhang>
		<oneLogin ref="oneLogin"></oneLogin>
		
		<view class="main-content">
			 <lc-fab-touch @fabClick="openJiZhangPage"></lc-fab-touch>		
			<view class="total-card">
				<view class="title" @click="openZhangbenPage()">
					<view class="icon iconfont icon-zhangben" style="font-size: 60rpx; "></view>
					<view >
					  {{zhangbenname}}
					</view>
					<view class="icon iconfont icon-xuanzeqizhankai" style="font-size: 45rpx; margin-left: 10rpx;"></view>
				</view>
				<view class="detail">
					<view class="dateclass">
<!-- 						<view class="yearclass" @click="clearStorage()">{{currentYear}}年</view>
 -->						<view class="yearclass">{{currentYear}}年</view>
						<view class="monthclass">
	<!-- 						<view style="font-size:60rpx;font-weight:bold;margin-top: 10rpx;">{{currentMonth}}</view>
							<view style="font-size:40rpx;margin-top: 20rpx;margin-left: 10rpx;">月</view> -->
							<picker mode="date" fields="month" :value="currentMonth" :start="startDate" :end="endDate" @change="bindMonthChange">
								<view class="monthclass">
									<view style="font-size:60rpx;font-weight:bold;margin-top: 10rpx;">{{currentMonth}}</view>
									<view style="font-size:40rpx;margin-top: 20rpx;margin-left: 10rpx;">月</view>
									<view class="icon iconfont icon-xuanzeqizhankai" style="font-size: 50rpx;margin-top: 20rpx;"></view>	
								</view>
							</picker>
						</view>
					</view>		
					<view class="splitclass">|</view>
					<view class="zhichuclass">
						<view style="font-size:35rpx;color: #FFFFFF;">本月支出</view>
						<view style="font-size:40rpx;font-weight:bold;margin-top: 15rpx;color: #FFFFFF;">¥ {{monthZhichu}}</view>
					</view>
					<view class="shouruclass">
						<view style="font-size:35rpx;color: #FFFFFF;">本月收入</view>
						<view style="font-size:30rpx;margin-top: 20rpx;color: #FFFFFF;">¥ {{monthShouru}}</view>
					</view>
				</view>
			</view>
			<!-- <view class="total-card2"></view> -->
	<!-- 		<view class="shouyedaohang">
				<view style="margin-top: 20rpx;">上一月</view>
				<view style="margin-top: 20rpx;">下一月</view>
			</view> -->
			<view class = "zhangdan-page" >
				<scroll-view class="zhangdan-list"  show-scrollbar="false"
					scroll-y="true" refresher-background="#F7F7F7">
					<view class="oneday-zhangdan" v-for="(item,index) in thisMonthDataMapCache" :key='index'>
						<view class="dayinfo-zhangdan">
							<view class="dayinfo-date" style="font-weight:bold;">{{item.displayDayName}}</view>
							<view class="dayinfo-zhichu">支出: {{item.zhichu}}</view>
							<view class="dayinfo-shouru">收入: {{item.shouru}}</view>
						</view>		
						<view v-for="(item2,index2) in item.data" :key='index2'>			
							<view class="jizhang-item"  @click="editJiZhang(item2.number, item2.date)">
								<view class="jizhang-category">
									<view class="categoryIcon"
										:style="[{ backgroundColor: item2.inv==0?'#7392ff':'#fd8008'}]" :class="[item2.category]">
									</view>
									<!-- <view class="categoryIcon" 
										:class="[item2.category]">
									</view> -->
									<view class="categoryTextCard">
										<view class="categoryText">{{item2.categoryName}}</view>
										<view class="beizhuText" v-if="item2.beizhuText!=''" >{{item2.beizhuText}}</view>
									</view>
									
								</view>
								<view class="countCard">
									<view v-if="item2.inv==1" class="itemCount" style="color: #BD2C00;">¥ {{item2.count}}</view>
									<view v-if="item2.inv!=1" class="itemCount" >¥ {{item2.count}}</view>
									<view class="createTimeOfDay" v-if="item2.createTimeOfDay!=''" >{{item2.createTimeOfDay}}</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>

	</view>
</template>

<script>
	import jizhang from '../../components/jizhang.vue'
	import common from "@/common/common.js"
	import oneLogin from '../../components/oneLogin.vue'
	
	export default {
		components: {
			jizhang,
			oneLogin
		},
		data() {
			return {
				thisMonthDataMapCache: {},
				monthShouru: '0.00',
				monthZhichu: '0.00',
				currentMonth: '1',
				currentDay:'28',
				currentYear: '2022',
				zhangbenname:'日常账本',
				zhangbenNum: '1',
				triggered: false,
			    scrollHeight:0, 
				touchT:0,
				touch:0,
				longTouch : false
			}
		},
		onLoad() {
			//初始化数据
			this.init();
			uni.$on('dataInsert', this.onzhangdanDataInsert);
			uni.$on('dataDelete', this.onzhangdanDataDelete);
			uni.$on('dataUpdate', this.onzhangdanDataUpdate);
		},
		
		onReady: function() {			
			//加载缓存的数据
			//this.getDataCache();
		},
		onShow() {		
			this.$nextTick(function(){
				this.$refs.tab.setNumber(0);
			});
			//隐藏系统导航条
			uni.hideTabBar({
			    animation: false
			})	
			
			this.getZhangbenCache();
			this.getDataCache();	
		},
		onHide() {
			//底部导航栏设置成当前页面未选中状态
			this.$nextTick(function(){
				this.$refs.tab.setNumber(5);
			})		
		},
		onBackPress(options) {
			return;
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods: {
			init(){
				var date = new Date();
				 this.currentYear =date .getFullYear();
				 this.currentMonth = date.getMonth()+1; 
				 this.currentDay = date.getDate();							 
			},
			getDate(type) {
						const date = new Date();
						let year = date.getFullYear();
						let month = date.getMonth() + 1;
						let day = date.getDate();
						this.year = year;
						this.month = month;
						if (type === 'start') {
							year = year - 20;
						} else if (type === 'end') {
							year = year + 0;
						}
						month = month > 9 ? month : '0' + month;
						day = day > 9 ? day : '0' + day;
						return `${year}-${month}-${day}`;
					},
			onzhangdanDataInsert(){
				this.getDataCache();
			},
			onzhangdanDataDelete(){
				this.getDataCache();
			},
			onzhangdanDataUpdate(){
				this.getDataCache();
			},
			openJiZhangPage() {
				var {isLogin} = common.getLoginState()
				if (!isLogin){
					//this.$refs.oneLogin.openOneLoginPage();
					this.$refs.jizhang.close()
					
					uni.showToast({
						title:"请先登录",
						mask:true,
						duration:2000,
						icon:'none',
						
					})
				}
				this.$refs.jizhang.open();
			},
			editJiZhang(number, day){
				var {userId} = common.getLoginState()
				var userActionLog = {
					actionType:'update',
					objectType:'zhangdan-'+number,
					username: userId,
					createTime: new Date()
				}
				common.insertUserActionLog(userActionLog)
				
				var {isLogin} = common.getLoginState()
				if (!isLogin){
					// this.$refs.oneLogin.openOneLoginPage();
					this.$refs.jizhang.close()
					
					uni.showToast({
						title:"请先登录",
						mask:true,
						duration:2000,
						icon:'none',
					})
				}				
				if (!this.longTouch) {
					this.$refs.jizhang.open(number, day)
				}
			},
			openZhangbenPage(){
				var {userId} = common.getLoginState()
				var userActionLog = {
					actionType:'click',
					objectType:'zhangdan.zhangben',
					username: userId,
					createTime: new Date()
				}
				common.insertUserActionLog(userActionLog)
				
				uni.navigateTo({
					url:  '/pages/zhangben/zhangben'
				})
			 },
		   bindMonthChange: function(e) {
			 		var monthYear = e.detail.value.split("-");
			 		this.currentMonth = monthYear[1];
			 		this.currentYear = monthYear[0];
					this.getZhangbenCache();
					this.getDataCache();	
					
					var {userId} = common.getLoginState()
					var userActionLog = {
						actionType:'switch',
						objectType:'zhangdan.month-'+monthYear,
						username: userId,
						createTime: new Date()
					}
					common.insertUserActionLog(userActionLog)
					
			    },
			getDataCache() {
				try {
					var dataMapCache = common.getDataCache()
					// console.log(dataMapCache);
					
				    if(!dataMapCache ){
						return;
					}
					var zhangben = dataMapCache[this.zhangbenNum];
					if(!zhangben){
						return;
					}
					
					var keys = Object.keys(zhangben).sort().reverse();
					var newDataMapCache = {};
					var monthShouruTemp = 0;
					var monthZhichuTemp = 0;
					
					for (var key in keys) {
						var tempDate = new Date(keys[key]);
						var tempYear =tempDate.getFullYear();
						var tempMonth = tempDate.getMonth()+1; 
						
						//当前月,只展示当前月
						if (tempYear!= this.currentYear || tempMonth!=this.currentMonth){
							continue;
						}

						var oneDayData = zhangben[keys[key]];
						var displayDate = this.getDayOfDate(keys[key]);
						var oneDayShouru = oneDayData.shouru;
						var oneDayZhichu = oneDayData.zhichu;
						if(oneDayData.data.length == 0){
							continue;
						}
						var oneDayDataObj = {
							'data': oneDayData.data,
							'shouru':oneDayShouru,
							'zhichu':oneDayZhichu,
							'displayDayName': displayDate
						}
						
						monthShouruTemp = parseFloat(monthShouruTemp) + parseFloat(oneDayShouru);
						monthZhichuTemp = parseFloat(monthZhichuTemp)+ parseFloat(oneDayZhichu);
						
						newDataMapCache[keys[key]] = oneDayDataObj;
					};
				
					this.thisMonthDataMapCache = newDataMapCache;
					
					this.monthShouru = monthShouruTemp;
					this.monthZhichu = monthZhichuTemp;
				} catch (e) {
					console.log(e);
				};
			},
			getZhangbenCache(){
				//缓存中 获取当前账本
				const cacheZhangbenNumber= common.getCurrentZhanbenNumber()
				if(!cacheZhangbenNumber){
					common.updateCurrentZhanbenNumber('1')
					cacheZhangbenNumber = '1';
				}
								
				//缓存中获取所有账本
				var zhangbenMapCache = {}
				var newZhangbenNum ='1';
				try {
					const cacheMap = common.getZhangbenCache()
					if (cacheMap) {
						zhangbenMapCache = cacheMap;	
						this.zhangbenname = zhangbenMapCache[cacheZhangbenNumber].name;
						newZhangbenNum = zhangbenMapCache[cacheZhangbenNumber].number;
					}else{
						this.zhangbenname = '默认账本';
						newZhangbenNum = '1';
					}
					
					if(!this.zhangbenNum || newZhangbenNum != this.zhangbenNum){
						this.zhangbenNum = newZhangbenNum;
						this.getDataCache();
					}
					
				} catch (e) {
					console.log(e);
				};	
			},
			
			clearStorage(e) {
				try {
					uni.clearStorageSync();
				} catch (e) {
					// error
				}
			},
			getDayOfDate(dateString) {
				 var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
				 
				 var dayOfDateString = "";
			     var date = (new Date(dateString));
				 var month = date.getMonth() +1;
				 var day = date.getDate();
				 var dayOfWeek = date.getDay();
				 var week = weeks[dayOfWeek];
				 dayOfDateString = month +"月" +day+"日" + " "+ week;
				
				 if(this.currentDay == day){
					 dayOfDateString = "今天" + " " + week;
				 }
				 return dayOfDateString;
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
		/* margin-left: 2%; */
		width: 100%;
     	height: 25%;
		background-image: linear-gradient(to bottom, #5a79ff, #7790ff);
	}

	.total-card2 {
		margin-top: 0rpx;
		width: 100%;
		height: 110rpx;
		background-image: linear-gradient(to bottom, #768fff, #FFFFFF);
	}

	.shouyedaohang {
		text-align: center;
		margin-left: 2%;
		width: 96%;
		background-color: #FFFFFF;
		position: fixed;
		top: 260rpx;
		height: 110rpx;
		border-radius: 5rpx;
		box-shadow: 0px 3px 10px #888888;
		-moz-box-shadow: 1px 2px 5px #888888;
		display: flex;
		flex-direction: row;
		justify-content: space-around;

	}

	.title {
		margin-top: 60rpx;
		margin-left: 20rpx;
		font-size: 45rpx;
		color: #000000;
		font-weight: bold;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.detail {
		margin-top: 30rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;	
	}

	.dateclass {
		margin-left: 25rpx;
		color: #1b1b1b;
	}

	.splitclass {
		margin-left: 30rpx;
		font-size: 70rpx;
		color: #414142;
		margin-top: 40rpx;
	}

	.yearclass {
		font-size: 35rpx;
		color: #1b1b1b;
	}

	.monthclass {
		display: flex;
		flex-direction: row;
	}

	.shouruclass {
		font-size: 45rpx;
		margin-left: 30rpx;
	}

	.zhichuclass {
		font-size: 45rpx;
		margin-left: 30rpx;
		margin-right: 10rpx;
	}

	.zhangdan-page {
		width: 100%;
		background-color: #F7F7F7;
		height: 75%;
	}
	
	.zhangdan-list {
		width: 92%;
		margin-left: 4%;
		margin-right: 4%;
		background-color: #F7F7F7;
		height: 100%;		
	}

	.dayinfo-zhangdan {
		margin-top: 20rpx;
		margin-bottom: 5rpx;
		font-size: 25rpx;
		color: #000000;
		display: flex;
		flex-direction: row;
		justify-content: space-between;		
	}

	.dayinfo-date {
		margin-left: 0rpx;
	}

	.dayinfo-shouru {
		margin-left: 10rpx;
	}

	.dayinfo-zhichu {
		margin-right: 30rpx;
	}

	.oneday-zhangdan {
		margin-top: 10rpx;
		margin-bottom: 80rpx;
	}

	.user-insert-line {
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #d4d5d8;
		left: 0px;
		right: 0px;
		height: 1px;
		content: '';
		margin-bottom: 20rpx;

	}

	.jizhang-item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		background-color: #FFFFFF;
		margin-bottom: 25rpx;
		margin-top: 10rpx;
		height: 140rpx;
		border-radius: 20rpx;
		align-items:center;
	}
	
	.categoryIcon {
		margin-left: 20rpx;
		border-radius: 20rpx;
		padding: 10rpx ;
		height: 50rpx;
		width: 50rpx;
		font-family: "iconfont" !important;
		font-size: 50rpx;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #FFFFFF;
		font-weight: bold;
		display: flex;
		align-content: normal;
		align-items: center;
		justify-content: center;
	}

	.jizhang-category {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-left: 20rpx;
	}
	
	.categoryText {
		font-size: 30rpx;
	}
	
	.beizhuText {
		font-size: 25rpx;
		margin-top: 10rpx;
		width: 300rpx;
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
	
	.categoryTextCard {
		margin-left:20rpx;
	}
	
	.countCard{
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		text-align: right;
	}
	
	.createTimeOfDay{
		font-size: 20rpx;
		margin-top: 10rpx;
		width: 150rpx;
		color: #888888;	
		margin-right: 25rpx;
	}
	
	.itemCount {
		margin-right: 25rpx;
		font-size: 35rpx;	
	}
	
</style>
