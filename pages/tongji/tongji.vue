<template>
	<view class="page">
		<!-- 底部tab导航 -->
		<tab ref="tab"></tab>
		
		<!-- 周选择器组件 -->
		<uni-popup ref="weekpopup" type="bottom">
			<!-- value值不传默认是当前周 -->
			<ccq-week-picker :value="weekvalue" @change="getWeeks"></ccq-week-picker>
		</uni-popup>
		
	    <!-- 账本选择底部弹出 -->
		<wyb-action-sheet ref="actionSheet" :options="options" @itemclick="onItemClick"/>
		<view class="main-content">
			<view class="tab-card">
				<view class="first-tab">
					<view class="zhangben"  @click="openZhangbenChoose()">
						<view class="icon iconfont icon-zhangben " style="font-size: 30rpx;" >{{zhangbenming}}</view>
<!-- 						<view class="icon iconfont icon-xuanzeqizhankai" style="font-size: 40rpx;"></view>
 -->					</view>
					
					<view class="zhichushouru">
						<view @click="changeShouruZhichuTab(1)" style="width: 150rpx;display: flex;flex-direction: column;align-items: center;">
							<view>支出</view>
							<view  :style="{width: zhichushourutype==1?'120rpx':'0rpx'}"
							class="under-line"></view>	
						</view>
						<view @click="changeShouruZhichuTab(2)" style="width: 150rpx;display: flex;flex-direction: column;align-items: center;">
							<view >收入</view>
							<view :style="{width: zhichushourutype==2?'120rpx':'0rpx'}"
							class="under-line"></view>
						</view>
					</view>
				</view>
				<view class="third-tab">
					<view class="week" @click="changeTimeType(1)"
					:style="{backgroundColor: timetype==1?'#000000':'#5a79ff',color:timetype==1?'#FFFFFF':'#000000'}">周</view>
					<view class="month" @click="changeTimeType(2)"
					:style="{backgroundColor: timetype==2?'#000000':'#5a79ff',color:timetype==2?'#FFFFFF':'#000000'}">月</view>
					<view class="year" @click="changeTimeType(3)"
					:style="{backgroundColor: timetype==3?'#000000':'#5a79ff',color:timetype==3?'#FFFFFF':'#000000'}">年</view>
				</view>
				<view class="fourth-tab">
					<view  class="timeandselect" v-if="timetype==1" @click="openWeek">
						<view class="uni-input">{{yearMonthWeek}}</view>
						<view class="icon iconfont icon-xuanzeqizhankai" style="font-size: 40rpx;"></view>
					</view>
					
					<picker mode="date"  v-if="timetype==2" fields="month" :value="month" :start="startDate" :end="endDate" @change="bindMonthChange">
						<view class="timeandselect">
							<view class="uni-input">{{year}}年{{month}}月</view>
							<view class="icon iconfont icon-xuanzeqizhankai" style="font-size: 40rpx;"></view>
						</view>		
					</picker>
					<picker mode="date"  v-if="timetype==3" fields="year" :value="year" :start="startDate" :end="endDate" @change="bindYearChange">
						<view class="timeandselect">
							<view class="uni-input">{{year}}年</view>
							<view class="icon iconfont icon-xuanzeqizhankai" style="font-size: 40rpx;"></view>			
						</view>
					</picker>
				</view>
			</view>
			<view class = "tongjipage" >
				<scroll-view class="scroll-list"  show-scrollbar="false"
					scroll-y="true" refresher-background="#F7F7F7">	
					<view class="tongji">
						<view class="tongji-first-row">
							<view style=" font-size: 30rpx;" v-if="timetype == '1'">第{{week.index}}周：</view>
							<view style="font-size: 30rpx;" v-if="timetype == '2'">{{month}}月：</view>
							<view style="font-size: 30rpx;" v-if="timetype == '3'">{{year}}年：</view>
							<view style="margin-left: 5rpx;font-size: 30rpx;">收支统计</view>
						</view>
						<view class="tongji-second-row">
							<view class="tongji-zhuchu">
								<view style="font-size: 30rpx;">支出</view>
								<view style="font-weight: bold;margin-top: 10rpx;">{{totalzhichu}}</view>
							</view>
							<view class="tongji-shouru">
								<view style="font-size: 30rpx;">收入</view>
								<view style="font-weight: bold;margin-top: 10rpx;">{{totalshouru}}</view>
							</view>
						</view>
					</view>
					<view class="linechart">
						<qiun-data-charts type="line" :opts="opts" :chartData="chartData"/>
					</view>
					<view class="ringchart">
						<view style="margin-left: 20rpx;display: flex;flex-direction: row;" >
							<view style="font-size: 30rpx;" v-if="timetype == '1'">第{{week.index}}周</view>
							<view style="font-size: 30rpx;" v-if="timetype == '2'">{{month}}月</view>
							<view style="font-size: 30rpx;" v-if="timetype == '3'">{{year}}年</view>	
							<view style="font-size: 30rpx;" v-if="zhichushourutype == '1'">支出分类</view>
							<view style="font-size: 30rpx;" v-if="zhichushourutype == '2'">收入分类</view>
						</view>
						<qiun-data-charts 
						  type="ring"
						  :opts="ringOpts"
						  :chartData="ringChartData"/>
					</view>
					<view class = "wordcloudchart">
						<view style="margin-left: 20rpx;display: flex;flex-direction: row;" >
							<view style="font-size: 30rpx;" v-if="timetype == '1'">第{{week.index}}周</view>
							<view style="font-size: 30rpx;" v-if="timetype == '2'">{{month}}月</view>
							<view style="font-size: 30rpx;" v-if="timetype == '3'">{{year}}年</view>	
							<view style="font-size: 30rpx;" v-if="zhichushourutype == '1'">支出词云</view>
							<view style="font-size: 30rpx;" v-if="zhichushourutype == '2'">收入词云</view>
						</view>
						    <qiun-data-charts 
						      type="word"
						      :chartData="wordChartData" />  
					</view>		
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>	
	import common from "@/common/common.js"
	import dayjs from 'dayjs';
    // 引入得到周信息函数
    import weekjs from '../../components/ccq-week-picker/week.js';
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				 currentDay: currentDate,
				 year: 2000,
				 month: 3,
				 fromDay : currentDate,
				 toDay: currentDate,
				 zhichushourutype : 1,
				 timetype: 1,
				 totalzhichu:'0.00',
				 totalshouru:'0.00',
				 zhangbenming:'全部',
				 zhangbenindex: '0',
				 options: ["全部"],
				 zhangbenCache:{},
				 todayWeek:dayjs().format('YYYY-MM-DD'),
				 yearMonthWeek: '',
				 week:'',
				 weekvalue: '',          
			     chartData: {},
				 chartTitle:"趋势",
				 wordChartData:{},
				 ringChartData:{},
				 ringtitle:"总支出",
				 ringsubTitle:234234234,
				 opts: {
					 color: ["#1890FF"],
					 padding: [15,15,0,15],
					 legend: {},
					 duration:500,
					 xAxis: {
					   disableGrid: true
					 },
					 yAxis: {
					   gridType: "dash",
					   dashLength: 2
					 },
					 extra: {
					   area: {
						 type: "curve",
						 opacity: 0.1,
						 addLine: true,
						 width: 2,
						 gradient: true
					   }
					 }
				   },
				    ringOpts: {
						 padding: [5,5,5,5],
						legend: {
						  show: false,
						  position: "right",
						  lineHeight: 15
						},
						extra: {
							 ring: {
							   ringWidth: 20,
							   activeOpacity: 0.5,
							   activeRadius: 10,
							   offsetAngle: 0,
							   labelWidth: 1,
							   border: true,
							   borderWidth: 1,
							   borderColor: "#FFFFFF"
							 }
							}
				         }
			}
		},
		onShow() {
			this.$nextTick(function(){
				this.$refs.tab.setNumber(1);
			})
			//隐藏系统导航条
			uni.hideTabBar({
			    animation: false
			})	
			
			this.currentDay =this.getDate({
				format: true
			})
			
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			this.year = year;
			this.month = month;
			
			//this.init();
			this.weekInit();
			this.init();
		},
	    onLoad() {
		    
			uni.$on('tongjiChange', this.onTongjiChange);
			uni.$on('dataInsert', this.onzhangdanDataInsert);
			//该页面只会有新增，删除和更新都是在账单页
			//uni.$on('dataDelete', this.onzhangdanDataDelete);
			//uni.$on('dataUpdate', this.onzhangdanDataUpdate);
		},
		onReady(){
			// this.getServerData();
			// this.getDataCache();
		},
		onHide() {
			this.$nextTick(function(){
				this.$refs.tab.setNumber(5);
			})		
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
			onzhangdanDataInsert(){
				this.init();
			},
			onzhangdanDataDelete(){
				this.init();
			},
			onzhangdanDataUpdate(){
				this.init();
			},
			changeShouruZhichuTab(type) {
				 this.zhichushourutype = type;
				 uni.$emit('tongjiChange');
				 
				 // var {userId} = common.getLoginState()
				 // var userActionLog = {
				 // 	actionType:'update',
				 // 	objectType:'tongji.shouruZhichuType-'+type,
				 // 	username: userId,
				 // 	createTime: new Date()
				 // }
				 // common.insertUserActionLog(userActionLog)
			    },
			changeTimeType(type){
				 this.timetype = type;
				 uni.$emit('tongjiChange');
				 
				 // var {userId} = common.getLoginState()
				 // var userActionLog = {
				 // 	actionType:'update',
				 // 	objectType:'tongji.timetype-'+type,
				 // 	username: userId,
				 // 	createTime: new Date()
				 // }
				 // common.insertUserActionLog(userActionLog)
			  },
			bindMonthChange: function(e) {
					var monthYear = e.detail.value.split("-");
					this.month = monthYear[1];
					this.year = monthYear[0];					
					uni.$emit('tongjiChange');
					
					// var {userId} = common.getLoginState()
					// var userActionLog = {
					// 	actionType:'update',
					// 	objectType:'tongji.month-'+monthYear,
					// 	username: userId,
					// 	createTime: new Date()
					// }
					// common.insertUserActionLog(userActionLog)
			   },
			bindYearChange: function(e) {
			   		this.year = e.detail.value;
					uni.$emit('tongjiChange');
					
					// var {userId} = common.getLoginState()
					// var userActionLog = {
					// 	actionType:'update',
					// 	objectType:'tongji.year-'+type,
					// 	username: userId,
					// 	createTime: new Date()
					// }
					// common.insertUserActionLog(userActionLog)
			    },
			onTongjiChange(){
				this.getDataCache()
				this.init();
			},
			weekInit(){
				let y = dayjs().year();
				let m = dayjs().month();
				let day = new Date().getDate();
				this.month = m+1;
				this.year = y;
				let res =  weekjs.getWeeksByMonth(y, this.month,this.todayWeek,"");
				var value = res.arr[0].val;
				if( new Date(value) > new Date()){
					res =  weekjs.getWeeksByMonth(y, this.month-1,this.todayWeek,"");
				}
				
				for(var i=0; i< res.arr.length; i++){
					var value = res.arr[i].val;
					var lastDay = new Date(new Date(value).setDate(new Date(value).getDate()+6));
					var newDate = new Date(lastDay);
					var nowDate = new Date();
					let day1 = newDate.getFullYear() + "-"+ parseFloat(newDate.getMonth()+1)+ "-"+newDate.getDate()
					let day2 = nowDate.getFullYear() + "-"+ parseFloat(nowDate.getMonth()+1) + "-"+nowDate.getDate()
					if (new Date(day1) >= new Date(day2)){
						this.setResultInfo(res.arr[i]);
						break
					}
				}
				
				//this.setResultInfo(res);
			},
			init(){
				// this.currentDay =this.getDate({
				// 	format: true
				// })
				this.getZhangbenCache();
				const cacheZhangbenNumber=common.getCurrentZhanbenNumber();
				this.zhangbenindex=cacheZhangbenNumber;
			    this.zhangbenming = this.zhangbenCache[cacheZhangbenNumber].name;				
				this.initData();
			},
			initData(){
				const qushiCategory=[];
				const qushiCategory2=[];
				const qushiCategory2Dic=[]
				const qushiData=[];
				const categoryDic=[];
				const zhanghuDic=[];
				const chiyunData = new Array();
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				var dataMapCache = common.getDataCache()	
				if(this.timetype==1){
					this.fromDay = this.week.year+'-'+this.week.start.split("(")[0].replace("月","-").replace("日","");
					this.toDay = this.week.year+'-'+this.week.end.split("(")[0].replace("月","-").replace("日","");
					var startDate = new Date(this.fromDay);
					for(var i=0; i< 7; i++){
						var dayOfDate = startDate.getDate()
						qushiCategory2[i]=startDate.getMonth()+1 + "/"+ dayOfDate
						
						if (dayOfDate<10){
							dayOfDate = "0"+dayOfDate;
						}
						var monthOfYear = startDate.getMonth()+1
						if(monthOfYear<10){
							monthOfYear = "0"+monthOfYear
						}
						qushiCategory[i]=monthOfYear + "-"+ dayOfDate
						startDate = startDate.setDate(startDate.getDate()+1);
					    startDate = new Date(startDate);
					}
				}else if(this.timetype==2){
					this.fromDay = this.year+'-'+this.month+'-01';
					if(this.year==year && this.month==month){
						this.toDay = this.currentDay;
					}else{
						  var new_date = new Date(this.year, this.month, 1);
						  //获取当月最后一天日期
						  this.toDay =this.year+'-'+this.month+'-'+ (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate();    
					}		
					var startDate = new Date(this.fromDay);
					var endDate = new Date(this.toDay);
					var i =0;
					while(startDate <= endDate){
						var dayOfDate = startDate.getDate()
						if(parseFloat(dayOfDate)%5 == 0){
							qushiCategory2[i]=dayOfDate
						}else{
							qushiCategory2[i]='.'
						}
						if (dayOfDate<10){
							dayOfDate = "0"+dayOfDate;
						}
						var monthOfYear = startDate.getMonth()+1
						if(monthOfYear<10){
							monthOfYear = "0"+monthOfYear
						}
						qushiCategory[i]=monthOfYear + "-"+ dayOfDate
						startDate = startDate.setDate(startDate.getDate()+1);
						startDate = new Date(startDate);
						i++;
					}
				}else if (this.timetype==3){
					this.fromDay = this.year+'-01-01';
					if(this.year==year){
						this.toDay = this.currentDay;
					}else{
						this.toDay= this.year+'-12-31';
					}
					var endDate = new Date(this.toDay);
					var endMonth=endDate.getMonth();
					for(var i=0; i<= endMonth; i++){
						qushiCategory2[i]=i+1;
					}
					var startDate = new Date(this.fromDay);
					var endDate = new Date(this.toDay);
					var i =0;
					while(startDate <= endDate){
						var dayOfDate = startDate.getDate()
						if (dayOfDate<10){
							dayOfDate = "0"+dayOfDate;
						}
						var monthOfYear = startDate.getMonth()+1
						if(monthOfYear<10){
							monthOfYear = "0"+monthOfYear
						}
						qushiCategory[i]=monthOfYear + "-"+ dayOfDate
						startDate = startDate.setDate(startDate.getDate()+1);
						startDate = new Date(startDate);
						i++;
					}
				}		
				if(dataMapCache ){
					//全部账本统计
					if (this.zhangbenindex == '0'){
						
					}else{
						var zhangben = dataMapCache[this.zhangbenindex];
						if(!zhangben){
							zhangben ={}
						}	
						var keys = Object.keys(zhangben).sort();
						this.totalshouru = '0.00';
						this.totalzhichu = '0.00';
						for(var i=0;i<qushiCategory.length; i++){
							var oneDayData  = zhangben[this.year+"-"+qushiCategory[i]]							
							//总数计算和分类计算
							if(oneDayData) {								
								this.totalshouru = parseFloat(this.totalshouru) + parseFloat(oneDayData.shouru);
								this.totalzhichu = parseFloat(this.totalzhichu) + parseFloat(oneDayData.zhichu);	
								for(let oneItem of oneDayData.data){
									if(this.zhichushourutype ==1){
										if(oneItem.inv !=0)continue
									}else if(this.zhichushourutype ==2){
										if(oneItem.inv !=1)continue
									}
									if(!categoryDic[oneItem.categoryName]){
										categoryDic[oneItem.categoryName] = oneItem.count;
									}else{
										categoryDic[oneItem.categoryName] = parseFloat(categoryDic[oneItem.categoryName])+
										parseFloat(oneItem.count);
									}
									
									if(!zhanghuDic[oneItem.zhanghuNum]){
										zhanghuDic[oneItem.zhanghuNum] = oneItem.count;
									}else{
										zhanghuDic[oneItem.zhanghuNum] = parseFloat(zhanghuDic[oneItem.zhanghuNum])+
										parseFloat(oneItem.count);
									}
								}
							}
														//按年统计，则按月分类
							if(this.timetype ==3){	
								var oneDayDate = new Date(this.year+"-"+qushiCategory[i]);
								if(!qushiCategory2Dic[oneDayDate.getMonth()+1]){
									qushiCategory2Dic[oneDayDate.getMonth()+1]=0;
								}
								if(oneDayData){
									if (this.zhichushourutype  ==1 ){
										qushiCategory2Dic[oneDayDate.getMonth()+1] = qushiCategory2Dic[oneDayDate.getMonth()+1]+oneDayData.zhichu
									}else if(this.zhichushourutype  ==2 ){
										qushiCategory2Dic[oneDayDate.getMonth()+1] = qushiCategory2Dic[oneDayDate.getMonth()+1]+oneDayData.shouru
									}
								}
							}else{
								// 其他按天分类
								if(oneDayData){
									if (this.zhichushourutype  ==1 ){
										qushiData[i]=oneDayData.zhichu
									}else if(this.zhichushourutype  ==2 ){
										qushiData[i]=oneDayData.shouru
									}
								}else{
									qushiData[i]=0;
								}
							}
						}
					}
					//按年统计特殊逻辑
					if(this.timetype ==3){
						var i =0;
						for(var i =0; i<qushiCategory2.length; i++){
							var dicValue = qushiCategory2Dic[i+1]
							if(dicValue){
								qushiData[i]=dicValue
							}else{
								qushiData[i]=0
							}
						}
					}
				}
				
				if(this.timetype==1){
					this.chartTitle = "第"+this.week.index+"周";
				}else if(this.timetype ==2){
					this.chartTitle = this.month+"月";
				}else if(this.timetype == 3){
					this.chartTitle = this.year+"年";
				}
				if(this.zhichushourutype ==1){
					this.chartTitle = this.chartTitle + "支出"
					this.ringtitle = "总支出"
					this.ringsubTitle = this.totalzhichu;
				}else if (this.zhichushourutype ==2){
					this.chartTitle = this.chartTitle + "收入"
					this.ringtitle = "总收入"
					this.ringsubTitle = this.totalshouru;
				}
				
				//趋势图
				let res = {
					categories: qushiCategory2,
					series: [
					  {
						name: this.chartTitle,
						data: qushiData
					  }
					]
				  };
				this.chartData = JSON.parse(JSON.stringify(res));
				
				//环形图
				var ringChartData2 = new Array();
				var maxOfCategory = 0;
				var minOfCategory = 0;
				
				for(var key in categoryDic){
					var temp={
						"name":key,
						"value":Math.abs(parseFloat(categoryDic[key])),
						"labelText":key+":"+Math.abs(parseFloat(categoryDic[key]))
					}
					if (Math.abs(parseFloat(categoryDic[key])) > maxOfCategory){
						maxOfCategory =Math.abs(parseFloat(categoryDic[key])) 
					}
					
					if(Math.abs(parseFloat(categoryDic[key]))< minOfCategory){
						minOfCategory = Math.abs(parseFloat(categoryDic[key]))
					}
					ringChartData2.push(temp)
				}
				
				for(var key in categoryDic){
					var textSize = 50* (Math.abs(parseFloat(categoryDic[key]))-minOfCategory)/(maxOfCategory-minOfCategory);
					if(textSize<10){
						textSize = 10;
					}
					var ciyun = {
						 name: key,
						 textSize:textSize,
						 data: undefined
					   }
					chiyunData.push(ciyun)	
				}
				let ringRes = { series: [{ data: ringChartData2}]};
				this.ringOpts.title ={
					name: this.ringtitle,
					fontSize: 15,
					color: "#666666"
				}
				this.ringOpts.subtitle={
					name: this.ringsubTitle,
					fontSize: 15,
					color: "#7cb5ec"
				}
			    this.ringChartData = JSON.parse(JSON.stringify(ringRes));
				
				//词云
				if(chiyunData && chiyunData.length==0){
					chiyunData.push({})
				}
				let wordRes = {series:chiyunData};
			    this.wordChartData = JSON.parse(JSON.stringify(wordRes));
			},
			getWeeks(res) {
				if (res) { 
					this.setResultInfo(res);
				}
				this.$refs['weekpopup'].close();
				uni.$emit('tongjiChange');
				
				// var {userId} = common.getLoginState()
				// var userActionLog = {
				// 	actionType:'update',
				// 	objectType:'tongji.week-'+type,
				// 	username: userId,
				// 	createTime: new Date()
				// }
				// common.insertUserActionLog(userActionLog)
			},
			setResultInfo(i){
			    var info =null;
				if(i.week){
					info = i.week;
				}else{
					info = i
				}
				
				if(info.val > this.currentDay){
					uni.showToast({
					  title: `只能选择小于当前周的时间`,
					   icon:'none',
					   duration: 1300
					})
					return;
				} 
				this.yearMonthWeek = `${info.year}年${info.month}月${info.text} `;
				this.week = info.week || info;
				this.weekvalue = info.val;
			},
			openWeek() {
				this.$refs['weekpopup'].open()
			},
			getDate(type) {
						const date = new Date();
						let year = date.getFullYear();
						let month = date.getMonth() + 1;
						let day = date.getDate();
						// this.year = year;
						// this.month = month;
						if (type === 'start') {
							year = year - 20;
						} else if (type === 'end') {
							year = year + 0;
						}
						month = month > 9 ? month : '0' + month;
						day = day > 9 ? day : '0' + day;
						return `${year}-${month}-${day}`;
					},
			openZhangbenChoose(){
					//this.$refs.actionSheet.showActionSheet(); 
			},
			getZhangbenCache(){			
				//缓存中获取所有账本
				try {
					const cacheMap = common.getZhangbenCache()
					if (cacheMap) {
						this.zhangbenCache = cacheMap;
						//this.options = ["全部"];
						this.options = [];
						for (var key in cacheMap) {
							this.options.push(cacheMap[key].name);
						   }
					}
				} catch (e) {
					console.log(e);
				};	
			},
			onItemClick(e) {
				this.zhangbenming = e.label;
				this.zhangbenindex ='0';
				if (this.zhangbenCache){
					var i = 1;
					for (var key in this.zhangbenCache) {
						if (i == e.index){
							this.zhangbenindex = this.zhangbenCache[key].number;
							break;
						}
						i ++;
					 }
				}
				//this.options=["全部2"];
				this.$refs.actionSheet.hideActionSheet(); 
				uni.$emit('tongjiChange');			
			 },
			  
			  getDataCache() {
			  	try {
			  		var dataMapCache = common.getDataCache()	
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
			align-items: center;
			width: 100%;
			background-color: #F7F7F7;			
		}
		.tongjipage {
			width: 100%;
			background-color: #F7F7F7;
			height: 75%;
		}
		.tab-card {
			margin-top: 0rpx;
			/* margin-left: 2%; */
			width: 100%;
		 	height: 30%;
			background-color: #5a79ff;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content:flex-start;
		}
		.zhangben{
			width: 20%;
			width: 30%;
			margin-left: 20rpx;
			display: flex;
			flex-direction: row;
		}
		.timeandselect{
			display: flex;
			flex-direction: row;
		}
		.scroll-list{
			width: 92%;
			margin-left: 4%;
			margin-right: 4%;
			background-color: #F7F7F7;
			height: 100%;	
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
		.first-tab{
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			align-items: center;
			margin-top: 60rpx;
			font-size: 45rpx;
			width: 100%;
		}
		.zhichushouru{
			width: 70%;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
		}
		.second-tab{
			display: flex;
			flex-direction: row;
			align-items: center;
			margin-top: 5rpx;
		}
		.under-line {
			margin-top: 2rpx;
			width: 120rpx;
			height: 2px;
			content: '';
			-webkit-transform: scaleY(.5);
			transform: scaleY(.5);
			background-color: #000000;
		}
		.third-tab{
			display: flex;
			flex-direction: row;
			align-items: center;
			margin-top: 20rpx;
			width: 90%;
		}
		.fourth-tab{
			margin-top: 20rpx;
		}
		.week{
			width: 33.3%;
			color: ##000000;
			border-style:solid;
			text-align: center;
			border-color: #000000;
			border-width: thin;
		}
		.month{
			width: 33.3%;
			color: ##000000;
			border-style:solid;
			text-align: center;
			border-color: #000000;
			border-width: thin;
		}
		.year{
			width: 33.3%;
			color: ##000000;
			border-style:solid;
			text-align: center;
			border-color: #000000;
			border-width: thin;
		}
		
		.tongji{
			height: 180rpx;
			background-color: #FFFFFF;
			border-radius: 20rpx;
			margin-top: 20rpx;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
		}
		
		.tongji-first-row{
			font-size: 25rpx;
			display: flex;
			flex-direction: row;
			margin-top: 20rpx;	
			margin-left: 20rpx;	
		}
		
		.tongji-second-row{
			display: flex;
			flex-direction: row;
			width: 100%;
			margin-top: 30rpx;
			margin-left: 20rpx;
		}
		
		.tongji-zhuchu{
			display: flex;
			flex-direction: column;
			width: 50%;
		}
		.tongji-shouru{
			display: flex;
			flex-direction: column;
			width: 50%;
		}
		
		.linechart{
			margin-top: 20rpx;
			border-radius: 20rpx;
			width: 100%;
			height: 400rpx;
			background-color: #FFFFFF;
		}
		.ringchart{
			margin-top: 20rpx;
			border-radius: 20rpx;
			width: 100%;
			height: 400rpx;
			background-color: #FFFFFF;
		}
		
		.wordcloudchart{
			margin-top: 40rpx;
			border-radius: 20rpx;
			width: 100%;
			height: 200rpx;
			background-color: #FFFFFF;
		}
</style>
