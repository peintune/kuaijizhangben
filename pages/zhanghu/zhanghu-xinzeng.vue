<template>
	<view class="page">
		<hx-navbar ref="hxnb" :config="config" />

		<view class="main-content">
			<view class="zhanghuType">
				<view class="zhanghutypeall">
					<view class="zhanghutypeicons-split" v-for="(item,index) in zhanghuTemplate" :key='index'>
						<view class="zhanghutypeicons" v-for="(item2,index2) in item" :key='index2'>
							<view class="zhanghutype-item" @click="chooseType(item2)">
								<view class="icondefault"
								:style="{backgroundColor: item2.templateId==templateId?'#7392ff':'#f0f1f4',color:item2.templateId==templateId?'#FFFFFF':'#aaa6a1'}"
								>
									<view class="categoryIcon"
										:class="[item2.icon] "></view>
								</view>
								<view class="type-name">{{item2.name}}</view>
							</view>
						</view>
						<!-- 					  <view class="splitclass">|</view>
 -->
					</view>
				</view>
			</view>
			<view class="content">
				<view class="first-row" v-show="isSystemZhanghu==false">
					<view class="textshuoming">名称：</view>
					<input class="input"  type="text" v-model="zhanghuname" maxlength="10"
						 placeholder="请输入账户名字" />
				</view>

				<view class="first-row" v-show="isSystemZhanghu==false">
					<view class="textshuoming">备注：</view>
					<input class="input" type="text"  v-model="zhanghubeizhu" maxlength="30"
						 placeholder="请输入资产账户备注信息" />
				</view>

				<view class="first-row">
					<view class="textshuoming">金额：</view>
					<input class="input" focus="true" type="number" v-model="zhanghucount" maxlength="10"
						placeholder="0.00" @input="numberFixedDigit" />
				</view>
			</view>
			<!-- <view class="user-insert-line"></view> -->
			<view class="addZhanghuBt" @click="addZhanghu()">保存</view>
			<view class="addZhanghuBt" v-show="isUpdate == true && isSystemZhanghu==false" @click="deleteZhangdan()">删除</view>
		</view>
	</view>
</template>

<script>
	import common from "@/common/common.js"
	
	export default {
		data() {
			return {
				config: {
					title: '新增资产账户',
					backgroundColor: [1, ['#a9a1ff', '#6970ff']]
				},
				zhanghuname: '现金',
				zhanghubeizhu: '',
				zhanghucount: "0",
				currentSelectategory: 0,
				oldSelectategory: 0,
				currentTypeName: '现金',
				templateId: 1,
				number: 1,
				currentIcon: 'icon-_xianjin',
				isUpdate: false,
				isSystemZhanghu: false,
				zhanghuTemplate: {
					0: [{
						"number": 1,
						"templateId": 1,
						"icon": "t-icon-_xianjin",
						"name": "现金",
						"type": "现金",
						"category": 0,
						"count": 0,
						"describe": ""
					}],
					1: [{
						"number": 2,
						"templateId": 2,
						"icon": "t-icon-zhifubao1",
						"name": "支付宝",
						"type": "在线支付",
						"category": 1,
						"count": 0,
						"describe": ""
					}, {
						"number": 3,
						"templateId": 3,
						"icon": "t-icon-weixin1",
						"name": "微信",
						"type": "在线支付",
						"category": 1,
						"count": 0,
						"describe": ""
					}],
					2: [{
							"number": 4,
							"templateId": 4,
							"icon": "t-icon-jiechu",
							"name": "借出",
							"type": "债务",
							"category": 2,
							"count": 0,
							"describe": ""
						},
						{
							"number": 5,
							"templateId": 5,
							"icon": "t-icon-zu-copy",
							"name": "借入",
							"type": "债务",
							"category": 2,
							"count": 0,
							"describe": ""
						}
					],
					3: [{
							"number": 6,
							"templateId": 6,
							"icon": "t-icon-gupiao1",
							"name": "股票",
							"type": "投资",
							"category": 3,
							"count": 0,
							"describe": ""
						},
						{
							"number": 7,
							"templateId": 7,
							"icon": "t-icon-jijin",
							"name": "基金",
							"type": "投资",
							"category": 3,
							"count": 0,
							"describe": ""
						}
					],
					4: [{
							"number": 8,
							"templateId": 8,
							"icon": "t-icon-chuxuqia-",
							"name": "储蓄卡",
							"type": "储蓄卡",
							"category": 4,
							"count": 0,
							"describe": ""
						},
						{
							"number": 9,
							"templateId": 9,
							"icon": "t-icon-xinyongka",
							"name": "信用卡",
							"type": "信用卡",
							"category": 4,
							"count": 0,
							"describe": ""
						}
					],
					5: [{
						"number": 10,
						"templateId": 10,
						"icon": "t-icon-qianbao1",
						"name": "自定义",
						"type": "自定义",
						"category": 5,
						"count": 0,
						"describe": ""
					}]
				}
			}
		},
		onShow() {},
		onLoad: function(options) {
			if (!options.pageParam) {
				this.isUpdate = false;
				this.config.title ='新增资产账户'
				return;
			}else{
				this.isUpdate = true;
			}
			
			
			this.config.title ='编辑资产账户'
			var paramArray = options.pageParam.split(",");
			var category = paramArray[0];
			var type = paramArray[1];
			var templateId = paramArray[2];
			var number = paramArray[3];
			
			//系统创建的账户
			if (number < 6){
				this.isSystemZhanghu = true;
			}else{
				this.isSystemZhanghu = false;
			}
			
			try {
				const zhanghuCache = common.getZhanghuCache()
				if (zhanghuCache) {
					this.isUpdate = true;
					var zhanghuCategoryArray = zhanghuCache[category];
					for (var zhanghu of zhanghuCategoryArray) {
						if (zhanghu.templateId == templateId) {
							this.zhanghubeizhu = zhanghu.describe
							this.zhanghuname = zhanghu.name
							this.zhanghucount = zhanghu.count
							this.currentSelectategory = zhanghu.category;
							this.oldSelectategory = zhanghu.category;
							this.currentIcon = zhanghu.icon;
							this.currentTypeName = zhanghu.type;
							this.templateId = zhanghu.templateId
							this.number = zhanghu.number;
						}
					}
				} else {
					return;
				}
			} catch (e) {
				console.log(e);
			};
		},
		methods: {
			chooseType(item) {
				if(this.isSystemZhanghu){
					uni.showToast({
					  title: `系统默认账户，只能修改金额`,
					   icon:'none',
					   duration: 1300
					})
					return
				}
				
				this.zhanghuname = item.name;
				this.currentSelectategory = item.category;
				this.currentIcon = item.icon;
				this.currentTypeName = item.type;
				this.templateId = item.templateId;
			},
			numberFixedDigit(e) { // 固定两位小数
				e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || ''
				this.$nextTick(() => {
					this.zhanghucount = e.target.value
				})
			},
			deleteZhangdan() {
				var {userId} = common.getLoginState()
				var userActionLog = {
					actionType:'delete',
					objectType:'zhanghu-',
					username: userId,
					createTime: new Date()
				}
				common.insertUserActionLog(userActionLog)
				
				if (this.isSystemZhanghu){
					uni.showToast({
					  title: `系统默认账户，不能删除`,
					   icon:'none',
					   duration: 1500
					})
					return
				}
				
				//TODO 删除时需要判断账户中是否有关联的数据。
				let that = this;
				uni.showModal({
					title: '删除此账户',
					content: '确认要删除此账户吗？',
					success: async function(res) {
						if (res.confirm) {
							const zhanghuCache = common.getZhanghuCache()
							const zhanghuCategoryArray = zhanghuCache[that.oldSelectategory];
							var deletedZhanghu =null
							for (let i = 0; i < zhanghuCategoryArray.length; i++) {
								var zhanghu = zhanghuCategoryArray[i];
								if (zhanghu.number == that.number) {
									if (zhanghu.count !=0){
										uni.showToast({
										  title: `账户金额不为0，不能删除`,
										   icon:'none',
										   duration: 2000
										})
										return
									}else{
										zhanghuCategoryArray.splice(i, 1);
									}
									deletedZhanghu = zhanghu
								}
							}
							zhanghuCache[that.oldSelectategory] = zhanghuCategoryArray;
							common.updateZhanghuCache(zhanghuCache)
							var {userId} = common.getLoginState()
							common.addChangedData('zhanghu',true,userId, deletedZhanghu)
							uni.navigateBack();
						}
					},
				})
			},
			addZhanghu() {
				
				var {userId} = common.getLoginState()
				var userActionLog = {
					actionType:'insert',
					objectType:'zhanghu-',
					username: userId,
					createTime: new Date()
				}
				common.insertUserActionLog(userActionLog)
				
				if (this.zhanghuname == 'undefined' || !this.zhanghuname || !/[^\s]/.test(this.zhanghuname)) {
					uni.showToast({
						title: `账户名称不能为空`,
						icon: 'none',
						duration: 1300
					})
					return;
				}

				if (this.zhanghucount == 'undefined' || this.zhanghucount == "") {
					uni.showToast({
						title: `金额不能为空`,
						icon: 'none',
						duration: 1300
					})
					return;
				}

				//缓存中设置默认账本
				try {
					const zhanghuCache = common.getZhanghuCache()
					if (!zhanghuCache) {
						const defaultZhanghuCache = {
							0: [{
								"number": 1,
								"templateId": 1,
								"icon": "t-icon-_xianjin",
								"name": "现金",
								"type": "现金",
								"category": 0,
								"count": 0,
								"describe": ""
							}],
							1: [{
								"number": 2,
								"templateId": 2,
								"icon": "t-icon-zhifubao1",
								"name": "支付宝",
								"type": "在线支付",
								"category": 1,
								"count": 0,
								"describe": ""
							}, {
								"number": 3,
								"templateId": 3,
								"icon": "t-icon-weixin1",
								"name": "微信",
								"type": "在线支付",
								"category": 1,
								"count": 0,
								"describe": ""
							}],
							2: [{
								"number": 4,
								"templateId": 4,
								"icon": "t-icon-jiechu",
								"name": "借出",
								"type": "债务",
								"category": 2,
								"count": 0,
								"describe": ""
								},
								{
								"number": 5,
								"templateId": 5,
								"icon": "t-icon-shouyi",
								"name": "借入",
								"type": "债务",
								"category": 2,
								"count": 0,
								"describe": ""
								}
							],
						};
						common.updateZhanghuCache(defaultZhanghuCache)
						var {userId} = common.getLoginState()
						for (var key in defaultZhanghuCache){
							for (var item of defaultZhanghuCache[key]){
								common.addChangedData('zhanghu',false,userId,item)
							}
						}
						zhanghuCache = defaultZhanghuCache;
					}

					var currentNumber;
					if (this.isUpdate) {
						currentNumber = this.number
					} else {
						var createDate = new Date();
						var timestamp = Date.parse(createDate);
						currentNumber = timestamp;
					}

					
					if (this.zhanghucount.length > 1 && this.zhanghucount.charAt(0) == 0){
						this.zhanghucount = this.zhanghucount.slice(1);
					}
					var oneItem = {
						"number": currentNumber,
						"templateId": this.templateId,
						"icon": this.currentIcon,
						"name": this.zhanghuname,
						"type": this.currentTypeName,
						"category": this.currentSelectategory,
						"count": this.zhanghucount,
						"describe": this.zhanghubeizhu
					}

					if (this.isUpdate) {
						var oldZhanghuCategoryArray = zhanghuCache[this.oldSelectategory];
						for (let i = 0; i < oldZhanghuCategoryArray.length; i++) {
							var zhanghu = oldZhanghuCategoryArray[i];
							if (zhanghu.number == currentNumber) {
								oldZhanghuCategoryArray.splice(i, 1);
							}
						}
						zhanghuCache[this.oldSelectategory] = oldZhanghuCategoryArray;
					}

					var zhanghuCategoryArray = zhanghuCache[this.currentSelectategory];
					if (!zhanghuCategoryArray) {
						zhanghuCategoryArray = [];
					}
					zhanghuCategoryArray.push(oneItem);
					zhanghuCache[this.currentSelectategory] = zhanghuCategoryArray;
					common.updateZhanghuCache(zhanghuCache)
					var {userId} = common.getLoginState()
					common.addChangedData('zhanghu',false,userId,oneItem)
					uni.navigateBack();
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

	.icondefault{
		display: flex;
		flex-direction: column;
		width: 90rpx;
		height: 90rpx;
		align-items:flex-start;
/* 		background-color: #7392ff;
 */		border-radius: 15rpx;
	}

	.categoryIcon {
		background-color: #f0f1f4;
		border-radius: 15rpx;
/* 		padding: 20rpx;
 */		width: 60rpx;
		height: 60rpx;
		margin-left: 15rpx;
/* 		margin-right: 15rpx;
 */		margin-top: 15rpx;
		font-family: "iconfont" !important;
		font-size: 30rpx;
		text-align: center;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #aaa6a1;
		font-weight: bold;
		align-content: normal;
	}

	.type-name {
		font-size: 30rpx;
	}

	.page {
		height: 100%;
		width: 100%;
		background-color: #F7F7F7;
	}

	.main-content {
		height: 90%;
		width: 100%;
		background-color: #F7F7F7;
		position: fixed;
		bottom: 0rpx;
		display: flex;
		flex-direction: column;
		align-items: center;

	}

	.zhanghuType {
		display: flex;
		flex-direction: column;
	}

	.content {
		width: 90%;
		display: flex;
		flex-direction: column;
		margin-top: 50rpx;
		align-items: center;
		border-radius: 30rpx;
		background-color: #FFFFFF;
	}

	.first-row {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 90rpx;
		width: 100%;
	}

	.textshuoming {
		margin-left: 30rpx;
		width: 20%;
	}

	.input {
		width: 80%;
	}

	.zhanghuType {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.zhanghutypeall {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-flow: wrap;
	}

	.zhanghutypeicons-split {
		display: flex;
		flex-direction: row;
	}

	.zhanghutypeicons {
		margin-left: 20rpx;
		margin-top: 20rpx;
		width: 130rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}


	.zhanghutype-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 30rpx;
	}

	.addZhanghuBt {
		margin-top: 50rpx;
		margin-bottom: 10rpx;
		width: 50%;
		color: #FFFFFF;
		background-image: linear-gradient(to bottom right, #5a79ff, #7392ff);
		border-radius: 20rpx;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.splitclass {
		margin-left: 30rpx;
		font-size: 30rpx;
		color: #414142;
		margin-top: 40rpx;
	}
</style>
