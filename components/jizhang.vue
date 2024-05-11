<template>
	<view>
		<!-- 		<button @click="open">打开弹窗</button>
 -->
		<wyb-action-sheet ref="actionSheet" :options="options" @itemclick="onItemClick"/>

		<uni-popup ref="popup" type="bottom" id="jizhangpage" >
		 	<view class="jizhangFrame">
		 				<!-- 详情区 -->
		 					<view class="detail" style="height: 70%;" >
								<view style="height: 70%;" class="header">
									<view class="daohang">	
<!-- 										<view style="margin-left: 10rpx;">{{jizhangType}}</view>
 -->										<view v-show="isUpdated==true" class="iconfont icon-shanchu3 " style="font-size: 40rpx ;font-weight: bold;margin-right:50rpx; margin-top: 5rpx; width: 70rpx;"
											@click="deleteZhangdan(number, canlenderText)"></view>
										<view  class="iconfont icon-guanbi guanbi" style="font-size: 40rpx ;font-weight: bold;margin-right:20rpx; margin-top: 5rpx; width: 70rpx;"
											@click="close()"></view>
									</view>
									<view class="qiehuanTotal">
										<view class="qiehuankuang">
											<view :class="['qiehuan',Inv== 0?'inv-h-se':'']" @click="tabclick(0)">
												支出
											</view>
											<view :class="['qiehuan',Inv== 1?'inv-h-se':'']" @click="tabclick(1)">
												收入
											</view>
										</view>
									</view>
					
									<view class="iconCategories" v-show="Inv == 0">
										<view class="categoryItem" v-for="(item,index) in categoryList" :key='index'>
											<view class="categoryIcon "
												:style="[{backgroundColor: item.iconStyleName==currentCategorySelect1 ?item.color: '#e8eaea'}
												,{color: item.iconStyleName==currentCategorySelect1 ? '#FFFFFF': '#9C9C9C'}]"
												:class="[item.iconStyleName]" @click="categoryClick(item)"></view>
											<text class="categoryText" style="font-size: 25rpx;">{{item.name}}</text>
										</view>
									</view>
									<view class="iconCategories" v-show="Inv == 1">
										<view class="categoryItem" v-for="(item,index) in categoryList2" :key='index'>
											<view class="categoryIcon"
												:style="[{backgroundColor: item.iconStyleName==currentCategorySelect2 ?item.color: '#e8eaea'}
												,{color: item.iconStyleName==currentCategorySelect2 ? '#FFFFFF': '#9C9C9C'}]"
												:class="[item.iconStyleName]" @click="categoryClick2(item)"></view>
											<text class="categoryText" style="font-size: 25rpx;">{{item.name}}</text>
										</view>
									</view>
								</view>				
		 						<view class="user-insert-line"></view>
								<view class="secondarea" style="height: 30%; margin-bottom: 0rpx; background-color: #FFFFFF;">
									<view class="zhanghuall">
										<view class="zhanghuoperation">
											<view class="icon iconfont icon-qiandai" style="font-size: 40rpx;"></view>
											<view style="font-size: 40rpx;">账户</view>			
										</view>				
										<view class="zhanghuName" @click="openZhanghuChoose()">
											<view>{{zhanghuName}}</view>
											<view class="icon iconfont icon-zhankai5"></view>	
										</view>	
									</view>							
									<view class="displayclass">
										<view class="zhanghuoperation" 	:style="[{ backgroundColor: currentCategoryColor ,color:'#FFFFFF'}]">
											<view class="icon iconfont" 
											:class="currentCategorySelect" style="font-size: 40rpx;"></view>
											<view style="font-size: 35rpx; margin-left: 3rpx;">{{currentCategoryName}}</view>			
										</view>	
										<view class="count">{{kong}}</view>
									</view>
									<view class="operaion">
										<text class="icon iconfont icon-bianji bianji"></text>
										<input class="beizhutext" maxlength=30 v-model="beizhuTextData" placeholder="点击添加备注"
											@input="onKeyInput"></input>
										<view class="calender" @click="openCalender()">{{canlenderText}}</view>
									</view>
								</view>
		 						
		 					</view>
		 				
		 				<!-- 键盘 -->
						<view style="height: 30%;" >
		 					<view style="display: flex; height: 50%; text-align: center;">
		 						<view class="buttom" style="width: 10%;">
		 							<view class="compute" hover-class="compute-button-hover" hover-stay-time=100
		 								@click="computeForSign('+')">+</view>
		 						</view>
		 						<view style="width: 70%; ">
		 							<view style="display: flex; height: 50%;">
		 								<view class="item" hover-class="button-hover" hover-stay-time=100
		 									@click="keyboardClick('7')">7</view>
		 								<view class="item" hover-class="button-hover" hover-stay-time=100
		 									@click="keyboardClick('8')">8</view>
		 								<view class="item" hover-class="button-hover" hover-stay-time=100
		 									@click="keyboardClick('9')">9</view>
		 							</view>
		 							<view style="display: flex; height: 50%; ">
		 								<view class="items" hover-class="button-hover" hover-stay-time=100
		 									@click="keyboardClick('4')">4</view>
		 								<view class="items" hover-class="button-hover" hover-stay-time=100
		 									@click="keyboardClick('5')">5</view>
		 								<view class="items" hover-class="button-hover" hover-stay-time=100
		 									@click="keyboardClick('6')">6</view>
		 							</view>
		 						</view>
		 						<view class="buttom" hover-class="button-hover" hover-stay-time=100 style="line-height: 200rpx;background-color: #f6f6f6;;"
		 							@click="deleteCount()">
		 							<text class="icon iconfont icon-zuojiantou1" ></text>
		 						</view>
		 					</view>
		 					<view style="display: flex; height: 50%;  text-align: center;">
		 						<view class="buttom" style="width: 10%;">
		 							<view class="compute" style="height: 100%;" hover-class="compute-button-hover" hover-stay-time=100
		 								@click="computeForSign('-')">-</view>
		 						</view>
		 						<view style="width: 70%;">
		 							<view style="display: flex; height: 50%; ">
		 								<view class="items" hover-class="button-hover" hover-stay-time=100
		 									@click="keyboardClick('1')">1</view>
		 								<view class="items" hover-class="button-hover" hover-stay-time=100
		 									@click="keyboardClick('2')">2</view>
		 								<view class="items" hover-class="button-hover" hover-stay-time=100
		 									@click="keyboardClick('3')">3</view>
		 							</view>
		 							<view style="display: flex; height: 50%;">
		 								<view class="items" hover-class="button-hover" hover-stay-time=100
		 									@click="keyboardClick('.')">.</view>
		 								<view class="items" hover-class="button-hover" hover-stay-time=100
		 									@click="keyboardClick('0')">0</view>
		 								<view class="items" style="line-height: 100rpx" hover-class="button-hover" hover-stay-time=100 @click="clear()">清除
		 								</view>
		 							</view>
		 						</view>
		 						<view class="buttom" ref="confirmBt"
		 							style="border-top: 0; line-height: 220rpx;  background-image:linear-gradient(to bottom right,#5a79ff,#7392ff); color: #FFF;"
		 							@click="confirmResult">{{confirmBtText}}</view>
		 					</view>
		 				</view>
		 			</view>
		</uni-popup>

		<uni-calendar ref="calendar" :insert="false"  :endDate="today" :lunar=true @confirm="confirmCalender" />
	</view>
</template>

<script>
	import common from "@/common/common.js"
	
	export default {
		name: "jizhang",
		data() {
			return {
				today:'2022-03-28',
				kong: '0.00',
				share_yt: true,
				isUpdated : false,
				clicked: '',
				jizhangType:'新增',
				Inv: 0,
				zhangbenNum: '1',
				zhanghuNum:'3',
				zhanghuName:'微信',
				zhanghuCategory:1,
				confirmBtText: '确定',
				canlenderText: new Date().toISOString().slice(0, 10),
				beforeUpdateCanlenderText :'',
				beizhuTextData: '',
				computeSign: '',
				fistComputeData: '',
				secondComputeData: '',
				createTime: '',
				number:'',
				createTimeOfDay: '',
				currentCategorySelect: 'icon-renminbi',
				currentCategoryColor: '#7392ff',
				currentCategoryName: '其他',
				currentCategorySelect1: 'icon-renminbi',
				currentCategoryColor1: '#7392ff',
				currentCategoryName1: '其他',
				currentCategorySelect2: 'icon-gongzihefang',
				currentCategoryColor2: '#fd8008',
				currentCategoryName2: '工资',
			    options: [],
				zhanghuCacheMap: {},
				categoryList: [{
						"name": "其他",
						"iconStyleName": "icon-renminbi",
						"color": "#7392ff"
					},
					{
						"name": "餐饮",
						"iconStyleName": "icon-canyinguanli",
						"color": "#7392ff"
					},
					{
						"name": "交通",
						"iconStyleName": "icon-jiaotong1",
						"color": "#7392ff"
					},
					{
						"name": "住房",
						"iconStyleName": "icon-fangzu",
						"color": "#7392ff"
					},
					{
						"name": "父母",
						"iconStyleName": "icon-fumu",
						"color": "#7392ff"
					},
					{
						"name": "宠物",
						"iconStyleName": "icon-xiedaichongwu",
						"color": "#7392ff"
					},
					{
						"name": "购物",
						"iconStyleName": "icon-gouwuche",
						"color": "#7392ff"
					},
					{
						"name": "充值",
						"iconStyleName": "icon-chongzhi1",
						"color": "#7392ff"
					},
					{
						"name": "水电",
						"iconStyleName": "icon-dianfeifuwu",
						"color": "#7392ff"
					},
					{
						"name": "医疗",
						"iconStyleName": "icon-yiliao",
						"color": "#7392ff"
					},
					{
						"name": "烟酒",
						"iconStyleName": "icon-yanjiu1",
						"color": "#7392ff"
					},
					{
						"name": "旅游",
						"iconStyleName": "icon-lvyou1",
						"color": "#7392ff"
					},{
						"name": "借出",
						"iconStyleName": "icon-jiechu",
						"color": "#7392ff"
					},
				],
				categoryList2: [{
						"name": "其他",
						"iconStyleName": "icon-qiandai",
						"color": "#fd8008"
					},
					{
						"name": "工资",
						"iconStyleName": "icon-gongzihefang",
						"color": "#fd8008"
					},
					{
						"name": "报销",
						"iconStyleName": "icon-shenqingbaoxiao",
						"color": "#fd8008"
					},{
						"name": "借入",
						"iconStyleName": "icon-zu-copy",
						"color": "#fd8008"
					},
				],
			}
		},

		methods: {
			onBackPress(e) {
				this.close();
				return true;
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
				try {
					const cacheMap = common.getZhangbenCache()
					if (cacheMap) {
						zhangbenMapCache = cacheMap;	
						this.zhangbenNum = zhangbenMapCache[cacheZhangbenNumber].number;
						return;
					}else{
						this.zhangbenNum = '1'
					}
				} catch (e) {
					console.log(e);
				};	
			},
			getZhanghuCache(zhanghunumber){		
				//缓存中获取所有账本
				try {
					const zhanghuCache = common.getZhanghuCache()
					var i =0;
					 this.options = [];
					 
					if(zhanghuCache) {
						for (var key in zhanghuCache) {
							   for(const item of zhanghuCache[key]){
								   //如果传入账户Id,则设置账户名称
								   if(zhanghunumber && item.number == zhanghunumber){
									   this.zhanghuName = item.name
								   }
								   
								   //借入借出 账户选择不一样
								   if(this.currentCategorySelect=='icon-jiechu'){
										if(item.templateId==4){
											this.options.push(item.name);
											this.zhanghuCacheMap[i] = item;
										}
								   }else if(this.currentCategorySelect=='icon-zu-copy'){
									   if(item.templateId==5){
										this.options.push(item.name);
										this.zhanghuCacheMap[i] = item;
									   }
								   }else{
									   if(item.templateId!=5 && item.templateId!=4){
										   this.options.push(item.name);
										   this.zhanghuCacheMap[i] = item;
									   }
								   }
									i ++;
								}
						   }
					}
				} catch (e) {
					console.log(e);
				};	
				
			},
			open(jizhangNum, day) {
				
				var {userId} = common.getLoginState()
				var userActionLog = {
					actionType:'open',
					objectType:'jizhang.open-'+jizhangNum,
					username: userId,
					createTime: new Date()
				}
				common.insertUserActionLog(userActionLog)
				
				this.$refs.popup.open('bottom');
				var date = new Date();
				var currentYear =date .getFullYear();
				var currentMonth = date .getMonth()+1; 
				var currentDay = date .getDate();	
				this.today = currentYear+"-"+currentMonth+"-"+currentDay;
				
				this.getZhangbenCache();
				//this.getZhanghuCache();
				
				//打开存在的，即编辑,通过天查询数据
				if (jizhangNum && day){
					this.isUpdated =true;
					var dataMapCache = common.getDataCache()
					if(dataMapCache ){
						var zhangben = dataMapCache[this.zhangbenNum];
						if(zhangben){
							var dayData = zhangben[day];
							if (dayData){
								for (let i = 0; i < dayData.data.length; i++) {
									var oneItem = dayData.data[i];
									if (oneItem.number && oneItem.number == jizhangNum){
										this.setProperties(oneItem);
										return;
									}
								  }
							}
						}	
					}				
				}else{
					this.isUpdated =false;
				}
				
				//否则清空变量
				this.resetProperties();			
			},
			close(e) {
				
				// var {userId} = common.getLoginState()
				// var userActionLog = {
				// 	actionType:'close',
				// 	objectType:'jizhang.close-',
				// 	username: userId,
				// 	createTime: new Date()
				// }
				// common.insertUserActionLog(userActionLog)
				
				// close window
				this.$refs.popup.close();
				
				//清空变量
				//this.resetProperties();	
			},
			onKeyInput: function(event) {
				this.beizhuTextData = event.target.value
			},
		    onItemClick(e) {				
				this.zhanghuName = e.label;
				var zhanghuItem= this.zhanghuCacheMap[e.index];
				this.zhanghuNum = zhanghuItem.number;
				this.zhanghuCategory = zhanghuItem.category;
				this.options=[];
				this.$refs.actionSheet.hideActionSheet(); 
			 },
			 openZhanghuChoose(){
				this.getZhanghuCache();
				this.$refs.actionSheet.showActionSheet(); 
			 },
			categoryClick(categoryItem) {
				this.currentCategorySelect = categoryItem.iconStyleName;
				this.currentCategoryColor = categoryItem.color;
				this.currentCategoryName = categoryItem.name;
				this.currentCategorySelect1 = categoryItem.iconStyleName;
				this.currentCategoryColor1 = categoryItem.color;
				this.currentCategoryName1 = categoryItem.name;
				
				this.zhanghuSelect(categoryItem);
			},
			categoryClick2(categoryItem) {
				this.currentCategorySelect = categoryItem.iconStyleName;
				this.currentCategoryColor = categoryItem.color;
				this.currentCategoryName = categoryItem.name;
				this.currentCategorySelect2 = categoryItem.iconStyleName;
				this.currentCategoryColor2 = categoryItem.color;
				this.currentCategoryName2 = categoryItem.name;
				this.zhanghuSelect(categoryItem);
			},
			zhanghuSelect(categoryItem){
				//借入借出 账户选择不一样
				if(categoryItem.iconStyleName=='icon-jiechu'){
					this.zhanghuNum='4'
					this.zhanghuName='借出'
					this.zhanghuCategory=2
				}else if(categoryItem.iconStyleName=='icon-zu-copy'){
					this.zhanghuNum='5'
					this.zhanghuName='借入'
					this.zhanghuCategory=2
				}else{
					this.zhanghuNum='3'
					this.zhanghuName='微信'
					this.zhanghuCategory=1
				}
			},
			tabclick(inv) {
				this.Inv = inv
				if (inv == 0) {
					this.currentCategorySelect = this.currentCategorySelect1
					this.currentCategoryColor = this.currentCategoryColor1
					this.currentCategoryName = this.currentCategoryName1
				} else if (inv == 1) {
					this.currentCategorySelect = this.currentCategorySelect2
					this.currentCategoryColor = this.currentCategoryColor2
					this.currentCategoryName = this.currentCategoryName2
				}
				this.beizhuTextData = '';
			},
			keyboardClick(number) {
				this.clicked = number;
				if (this.kong == '0.00' || this.kong == '0' || this.kong == '0.0') {
					if (number == '.') {
						this.kong = '0.'
						this.fistComputeData = '';
					} else {
						this.kong = number
						this.fistComputeData = number
					}
				} else {
					var tempNumber = this.fistComputeData;
					if (this.computeSign.length > 0) {
						tempNumber = this.secondComputeData;
					}

					if (number == '.') {
						if (tempNumber.indexOf(".") != -1) {
							return
						}
					}

					if (tempNumber.indexOf(".") != -1) {
						var index = tempNumber.lastIndexOf(".");
						if (tempNumber.length - index > 2) {
							return
						}
						if (tempNumber.length > 13) {
							return
						}
					} else {
						if (tempNumber.length > 10) {
							return
						}
					}
					tempNumber = tempNumber + number
					if (this.computeSign.length > 0) {
						this.secondComputeData = tempNumber
						this.kong = this.fistComputeData + this.computeSign + this.secondComputeData
					} else {
						this.fistComputeData = tempNumber
						this.kong = this.fistComputeData
					}
				}
			},
			deleteCount() {
				const deleteValue = this.kong.substr(this.kong.length - 1, this.kong.length);
				if (deleteValue == '+' || deleteValue == '-') {
					this.computeSign = '';
					this.confirmBtText = "确定";
					this.secondComputeData = '';
					this.kong = this.kong.substr(0, this.kong.length - 1);
					return
				}

				this.kong = this.kong.substr(0, this.kong.length - 1);
				if (this.computeSign.length > 0) {
					this.secondComputeData = this.secondComputeData.substr(0, this.secondComputeData.length - 1);
				} else {
					this.fistComputeData = this.fistComputeData.substr(0, this.fistComputeData.length - 1);
				}

				if (this.kong == '') {
					this.fistComputeData = ''
					this.kong = '0'
				}
			},
			clear() {
				this.kong = '0.00';
				this.computeSign = '';
				this.confirmBtText = "确定";
				this.fistComputeData = '';
				this.secondComputeData = '';
			},
			computeForSign(sign) {
				if (this.computeSign.length > 0) {
					return;
				}
				this.confirmBtText = "=";
				this.computeSign = sign;
				this.fistComputeData = this.kong;
				this.kong = this.kong + sign;
			},
			confirmResult() {
				
				var {userId} = common.getLoginState()
				var userActionLog = {
					actionType:'insert',
					objectType:'jizhang.save-',
					username: userId,
					createTime: new Date()
				}
				common.insertUserActionLog(userActionLog)
				
				if (this.confirmBtText == '=') {
					const position = this.kong.indexOf(this.computeSign);

					if (this.computeSign == '+') {
						this.kong = parseFloat(this.fistComputeData) + parseFloat(this.secondComputeData);
					}

					if (this.computeSign == '-') {
						this.kong = parseFloat(this.fistComputeData) - parseFloat(this.secondComputeData);
					}
					this.kong = this.kong + ''
					this.confirmBtText = '确定'
					this.computeSign = ''
					this.secondComputeData = ''
					this.fistComputeData = this.kong
					return;
				}

				if (this.kong == '0.00' || this.kong == '0.0' || this.kong == '0.' || this.kong == '.' || this.kong ==
					'.0' || this.kong == '0') {
					uni.showToast({
						title: "请输入金额",
						icon: "none",
						duration: 1500
					})
					return
				}

				//插入本地数据库中
				var dataMapCache = {}
				try {
					const cacheMap = common.getDataCache()
					if (cacheMap) {
						dataMapCache = cacheMap;
					}
				} catch (e) {
					console.log(e);
				};

				var dataOfOneDay = {}
				var dataOfOneDayData =[];
				var zhangben={}
				
				if (dataMapCache[this.zhangbenNum]){
					zhangben = dataMapCache[this.zhangbenNum];
				}
				
				if (zhangben[this.canlenderText]) {
					dataOfOneDay = zhangben[this.canlenderText];
					dataOfOneDayData = dataOfOneDay.data;
				}
				
				//删除以前日期的后再添加新日期的
				if (this.beforeUpdateCanlenderText !='' && 
				this.beforeUpdateCanlenderText != this.canlenderText){
					var beforeDataOfOneDayData = zhangben[this.beforeUpdateCanlenderText].data;
					if(beforeDataOfOneDayData){
						for (let i = 0; i < beforeDataOfOneDayData.length; i++) {
							var cacheItem = beforeDataOfOneDayData[i];
							if(cacheItem.number == this.number){
								beforeDataOfOneDayData.splice(i,1);
								var oneDayshouru=0
								var oneDayzhichu=0
								//计算一天的信息
								for(const item of beforeDataOfOneDayData){
									if (item.inv ==0){
										oneDayzhichu = parseFloat(oneDayzhichu )+ parseFloat(item.count.replace('-',''));
									}
									if(item.inv ==1){
										oneDayshouru =parseFloat(oneDayshouru)+ parseFloat(item.count.replace('+',''));
									}
								}
								if(beforeDataOfOneDayData.length == 0){
									delete zhangben[this.beforeUpdateCanlenderText];		
								}else{
									zhangben[this.beforeUpdateCanlenderText].zhichu =oneDayzhichu;
									zhangben[this.beforeUpdateCanlenderText].shouru =oneDayshouru;
									zhangben[this.beforeUpdateCanlenderText].data = beforeDataOfOneDayData;
								}	
								break;
							}
						 }
					}
				}
				

				try {
					var count = this.kong;
					if (this.Inv ==0){
						if(!count.startsWith("-")){
							if(count.startsWith("+")){
								count = count.slice(1)
							}
							count = "-"+count;
						}
					}else if(this.Inv ==1){
						if(!count.startsWith("+")){
							if(count.startsWith("-")){
								count = count.slice(1)
							}
							count = "+"+count;
						}
					}
					
					var createDate = new Date();
					var timestamp = Date.parse(createDate);
					var hour = createDate.getHours();
					var minitue = createDate.getMinutes();
										
					if (this.createTimeOfDay == ''){
						this.createTimeOfDay =  hour +"点" + minitue +"分";
					}
					if(this.number ==''){
						this.number = timestamp
					}
					
					var oneItem = {
						'number': this.number,
						'date': this.canlenderText,
						'count': count,
						'inv': this.Inv,
						'beizhuText': this.beizhuTextData,
						'category': this.currentCategorySelect,
						'categoryName': this.currentCategoryName,
						'createTime': createDate.toISOString(),
						'createTimeOfDay': this.createTimeOfDay,
						'zhangbenNum':this.zhangbenNum,
						'zhanghuNum':this.zhanghuNum,
						'zhanghuCategory':this.zhanghuCategory
					};
					
					//插入当前数据到本地缓存中
					var isUpdate = false;
					var oldItem = null
					for (let i = 0; i < dataOfOneDayData.length; i++) {
						var cacheItem = dataOfOneDayData[i];
						if(cacheItem.number == this.number){
							oldItem = cacheItem
							dataOfOneDayData[i] = oneItem;
							isUpdate = true;
							break;
						}
					 }
					
					if (!isUpdate){
						dataOfOneDayData.unshift(oneItem)
					}
					
					dataOfOneDay.data = dataOfOneDayData;
					var oneDayshouru=0
					var oneDayzhichu=0
					
					//计算一天的信息
					for(const item of dataOfOneDayData){
						if (item.inv ==0){
							oneDayzhichu = parseFloat(oneDayzhichu )+ parseFloat(item.count.replace('-',''));
						}
						
						if(item.inv ==1){
							oneDayshouru =parseFloat(oneDayshouru)+ parseFloat(item.count.replace('+',''));
						}
					}
					dataOfOneDay.zhichu =oneDayzhichu;
					dataOfOneDay.shouru =oneDayshouru;
					
					zhangben[this.canlenderText] = dataOfOneDay;
					dataMapCache[this.zhangbenNum] = zhangben;
					common.updateDataCache(dataMapCache)
					if (this.isUpdated){
						uni.$emit('dataUpdate', {oldItem,oneItem});
					}else{
						uni.$emit('dataInsert', oneItem);
					}
				} catch (e) {
					console.log(e);
				};

				// close window
				this.$refs.popup.close();
				uni.redirectTo({
					url:  '/pages/zhangdan/zhangdan'
				})
				//this.resetProperties()
			},
			resetProperties() {
				this.kong = '0.00'
				// 保留上次选择值
				// this.currentCategorySelect = 'icon-renminbi'
				// this.currentCategoryColor = '#7392ff'
				// this.currentCategoryName = '其他'
				// this.currentCategorySelect1 = 'icon-renminbi'
				// this.currentCategoryColor1 = '#7392ff'
				// this.currentCategoryName1 = '其他'
				
				if(this.Inv==1){
					this.currentCategorySelect = this.currentCategorySelect1
					this.currentCategoryColor = this.currentCategoryColor1
					this.currentCategoryName = this.currentCategoryName1
					this.zhanghuNum='3'
					this.zhanghuName='微信'
					this.zhanghuCategory=1
				}
				this.currentCategorySelect2 = 'icon-gongzihefang'
				this.currentCategoryColor2 = '#fd8008'
				this.currentCategoryName2 = '工资'
				this.beizhuTextData = ''
				this.canlenderText = new Date().toISOString().slice(0, 10);
				this.beforeUpdateCanlenderText = new Date().toISOString().slice(0, 10);
				this.createTimeOfDay='';
				this.number='';
				this.Inv=0;
				this.options = [];
				this.zhanghuCacheMap={};
			},
			setProperties(item){	
				this.Inv = item.inv
				if(this.Inv == 0){
					this.currentCategorySelect1 = item.category
					this.currentCategoryColor1 = '#7392ff'
					this.currentCategoryName1 = item.categoryName
					this.currentCategorySelect2 = 'icon-gongzihefang'
					this.currentCategoryColor2 = '#fd8008'
					this.currentCategoryName2 = '工资'
				}else if(this.Inv == 1){
					this.currentCategorySelect1 = 'icon-renminbi'
					this.currentCategoryColor1 = '#7392ff'
					this.currentCategoryName1 = '其他'
					this.currentCategorySelect2 = item.category
					this.currentCategoryColor2 = '#fd8008'
					this.currentCategoryName2 = item.categoryName
				}
				
				this.currentCategorySelect = item.category
				this.currentCategoryColor = '#7392ff'
				this.currentCategoryName = item.categoryName
				this.createTime = item.createTime,
				this.createTimeOfDay=item.createTimeOfDay,
				this.beizhuTextData = item.beizhuText
				this.zhangbenNum = item.zhangbenNum
				this.number = item.number
				this.kong = item.count
				this.canlenderText = item.date
				this.beforeUpdateCanlenderText = item.date
				this.zhanghuNum = item.zhanghuNum
				this.zhanghuCategory= item.zhanghuCategory
			
				//设置账户名称
				this.getZhanghuCache(this.zhanghuNum)
			},
			openCalender() {
				this.$refs.calendar.open();
			},
			confirmCalender(e) {
				this.canlenderText = e.fulldate;
			},
			deleteZhangdan(number,day) {
				let that = this;
			   uni.showModal({
			   　　　　　　　　title: '删除此条记账记录',
			   　　　　　　　　content: '确认要删除此条记录吗？',
			   　　　　　　　　success:async function(res) {
			   　　　　　　　　　　if (res.confirm) {			
			   								var dataMapCache = {}
			   								try {
			   									const cacheMap = common.getDataCache()
			   									if (cacheMap) {
			   										dataMapCache = cacheMap;
			   									}
			   								} catch (e) {
			   									console.log(e);
			   								};
			   								
			   								var dataOfOneDay = {}
			   								var dataOfOneDayData =[];
			   								var zhangben={}
			   								
			   								if (dataMapCache[that.zhangbenNum]){
			   									zhangben = dataMapCache[that.zhangbenNum];
			   								}
											
											var deletedItem={}
	
			   								if (zhangben[day]) {
			   									dataOfOneDay = zhangben[day].data;
			   									for (let i = 0; i < dataOfOneDay.length; i++) {
			   										var cacheItem = dataOfOneDay[i];
			   										if(cacheItem.number == number){
			   											dataOfOneDay.splice(i,1);
														deletedItem = cacheItem;											
			   											var oneDayshouru=0
			   											var oneDayzhichu=0
			   											//计算一天的信息
			   											for(const item of dataOfOneDay){
			   												if (item.inv ==0){
			   													oneDayzhichu = parseFloat(oneDayzhichu )+ parseFloat(item.count.replace('-',''));
			   												}
			   												
			   												if(item.inv ==1){
			   													oneDayshouru =parseFloat(oneDayshouru)+ parseFloat(item.count.replace('+',''));
			   												}
			   											}
			   											if(dataOfOneDay.length == 0){
			   												delete zhangben[day];
			   											}else{
			   												zhangben[day].zhichu =oneDayzhichu;
			   												zhangben[day].shouru =oneDayshouru;
			   												zhangben[day].data = dataOfOneDay;
			   											}
			   											break;
			   										}
			   									 }
			   								}
			   								
			   								dataMapCache[that.zhangbenNum] = zhangben;
											common.updateDataCache(dataMapCache)
											//加载缓存的数据
											uni.$emit('dataDelete', deletedItem);
											that.$refs.popup.close();
			   　　　　　　　　} else if (res.cancel) {
			   　　　　　　　　　//　console.log('用户点击取消')
			   　　　　　　　　}
			   　　　　　　}
			   　　　　});
			   
			   }
		}
	}
</script>

<style>
	@import url("/static/fonts/iconfont.css");
	@import url("/static/fonts/iconfont-weapp-icon.css");

	/* 键盘 */
	.item {
		border: 1rpx solid #e7e7e7;
		line-height: 100rpx;
		border-right: 0;
		width: 33%;
		background-color: #f6f6f6;

	}

	/* top = 0 */
	.items {
		border: 1rpx solid #e7e7e7;
		line-height: 100rpx;
		border-right: 0;
		width: 33%;
		border-top: 0;
		background-color: #f6f6f6;
	}

	.img {
		width: 70rpx;
		height: 70rpx;
	}

	.buttom {
		width: 25%;
		border: 1rpx solid #e7e7e7;
	}

	/* 弹窗 */
	.box {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0rpx;
		left: 0rpx;
		bottom: 0rpx;
		right: 0rpx;
		/* 如果需要背景颜色黑色打开这个 */
		/* background-color: rgba(0, 0, 0, 0.4); */
		transition: .1s;
		z-index: 999;
	}

	/* 进入分享动画 */
	.show {
		transition: all 0.1s ease;
		transform: translateY(0%) !important;
	}

	
	.detail {
		border-radius: 24rpx 24rpx 0 0;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
	}
	
	.operaion {
		width: 100%;
		display: flex;
		flex-direction: row;
		font-size: 25rpx;
		align-items:center;
		margin-bottom: 10rpx;
	}

	.jianpan {
		margin-left: 5%;
		margin-bottom: 20rpx;
		width: 90%;
		height: 35%;
		background-color: #f6f6f6;
		transition: all 0.1s ease;
		transform: translateY(100%);
		z-index: 1999;		
	}
	
	.jizhangFrame{
		display: flex;
		height: 100%;
		flex-direction: column;
		justify-content: space-around;
		height : 1300rpx;
		width: 90%;
		position: absolute;
		bottom: 20rpx;
		left: 5%;
		border-radius: 24rpx 24rpx 24rpx 24rpx;
	}

	.guanbi {
		/* position: fixed;
		top: 20rpx;
		right: 35rpx; */
	}

	

	.bianji {
		width: 7%;
		font-size: 40rpx;
		padding-left: 10rpx;
		display: flex;
		flex-direction: row;
	}

	.beizhutext {
		width: 60%;
		display: flex;
		font-size: 30rpx;
	}

	.calender {
		width: 23%;
		background-color: #fd8008;
		color: #FFFFFF;
		padding: 10rpx;
		border-radius: 10rpx;
		text-align: center;
	}
	
	.zhanghuoperation{
		margin-bottom: 10rpx;
		background-color: #fd8008;
		width: 18%;
		height: 60rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		color: #FFFFFF;
		border-radius: 0 10rpx 10rpx 0;
	}
	
	.zhanghuName{
		margin-left: 10rpx;
		margin-bottom: 10rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		height: 60rpx;
	}

	.zhanghuall{
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}
	
	.secondarea{
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}
	
	.displayclass {
		width: 100%;
		display: flex;
		flex-direction: row;
		font-size: 40rpx;
		align-items: center;
	}

	.category {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		/* background-color: #d24597; */
		margin-bottom: 10rpx;
	}

	.count {
		width: 60%;
		/* 		background-color: #4CD964;
 */
		text-align: right;
		color: #5a79ff;
		padding: 15rpx;
		font-size: 60rpx;
	}

	.iconCategories {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		margin-top: 20rpx;
	}
	
	.header{
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.daohang {
		width: 100%;
		height: 90rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
	}

	.qiehuanTotal{
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.qiehuankuang {
		background-color: #e8eaea;
		width: 45%;
		display: flex;
		flex-direction: row;
		border-radius: 15rpx;
		justify-content: space-between;
	}

	.qiehuan {
		margin: 5rpx 5rpx 5rpx 5rpx;
		border-radius: 15rpx;
		text-align: center;
		background-color: #e8eaea;
		width: 170rpx;
		font-size: 38rpx;
	}

	.inv-h-se {
		background-color: #FFFFFF;
	}

	.categoryItem {
		display: flex;
		flex-direction: column;
	}

	.categoryIcon {
		background-color: #f0f1f4;
		border-radius: 15rpx;
		padding: 20rpx;
		width: 40rpx;
		height: 40rpx;
		margin-left: 15rpx;
		margin-right: 15rpx;
		margin-top: 15rpx;
		font-family: "iconfont" !important;
		font-size: 40rpx;
		text-align: center;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #aaa6a1;
		font-weight: bold;
		align-content: normal;
	}
	
	.categoryText {
		color: #aaa6a1;
		text-align: center;
		margin: 0rpx;
	}

	.categoryIco2 {
		background-color: #e8eaea;
		border-radius: 15rpx;
		padding: 15rpx;
		margin-left: 10rpx;
		width: 40rpx;
		height: 40rpx;
		font-family: "iconfont" !important;
		font-size: 45rpx;
		text-align: center;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		font-weight: bold;
		align-content:normal;
	}

	.user-insert-line {
		margin-top: 5rpx;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #d4d5d8;
		
	}

	.button-hover {
		background-color: #8c8d91;
		-moz-box-shadow: 2px 2px 10px #06c;
		-webkit-box-shadow: 2px 2px 10px #06c;
		box-shadow: 2px 2px 10px #06c;
	}

	.compute {
		text-align: center;
		line-height: 200rpx;
		background-color: #fd8008;
		color: #FFFFFF;
		
		font-size: 50rpx;
	}

	.compute-button-hover {
		background-color: #d66f08;
	}
</style>
