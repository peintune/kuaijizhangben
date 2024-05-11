<template>
	<view class="ccq-week-picker">
		<view class="ccq-week-popup_header">
			<text class="ccq-week-popup-text cancel" @click="onCancel">取消</text>
			<text class="ccq-week-popup-text sure" @click="onSure">确定</text>
		</view>
		<picker-view :value="pickerValue" @change="bindChange" class="ccq-week-picker_view"
			:indicatorStyle="'height:'+height+'px'">
			<picker-view-column class="ccq-week-picker_item years">
				<view class="ccq-week-picker_item_view" :style="{'height':height+'px'}" v-for="(item,index) in years"
					:key="index">{{item}}年</view>
			</picker-view-column>
			<picker-view-column class="ccq-week-picker_item months">
				<view class="ccq-week-picker_item_view" :style="{'height':height+'px'}" v-for="(item,index) in months"
					:key="index">{{index+1}}月</view>
			</picker-view-column>
			<picker-view-column class="ccq-week-picker_item weeks">
				<view class="ccq-week-picker_item_view" :style="{'height':height+'px'}" v-for="(item,index) in weeks"
					:key="index">{{item.text}}</view>
			</picker-view-column>
		</picker-view>
	</view>
</template>

<script>
	import dayjs from 'dayjs';
	import weekjs from '../../components/ccq-week-picker/week.js'
	export default {
		name: "ccq-week-picker",
		props: {
			value: {
				type: String,
				default: ''
			},
			/**
			 * 格式化
			 * 0:  2021-06-01
			 * 1:  2021年06月01日
			 */
			formatType: {
				type: Number,
				default: 0
			},
			// 列的高度
			height: {
				type: [Number, String],
				default: 50
			},

		},
		data() {
			return {
				years: [],
				months: 12,
				weeks: [],
				pickerValue: [0, 0, 0],
				result: {
					week: ''
				}
			};
		},
		computed: {
			val() {
				return this.value || dayjs().format('YYYY-MM-DD')
			}
		},
		created() {
			this.dateInit();
		},
		methods: {
			async dateInit() {
				let v = this.val.split('-');
				let s = Number(v[0]) - 50;
				let e = Number(v[0]) + 50;
				let y = Number(v[0]),
					y_index;
				let m = Number(v[1]);

				// 年
				for (var i = s; i <= e; i++) {
					if (i == y) {
						//所选年的index 
						y = i;
						y_index = e - s - (e - y)
					}
					this.years.push(i)
				}
				// 月
				for (var i = 1; i <= 12; i++) {
					if (i == Number(m)) { //所选月的index
						m = i;
						break;
					}
				}
				// 周
				let res = await weekjs.getWeeksByMonth(y, m,this.val,this.formatType); 
				this.weeks =  res.arr;
				this.$set(this.pickerValue, 2, await res.weekIndex - 1)
				this.$set(this.pickerValue, 0, y_index)
				this.$set(this.pickerValue, 1, m - 1)
				this.result = {
					week: res.week
				}
			},
			// picker change
			bindChange(e) {
				let v = e.detail.value;
				this.pickerValue = v;
				let y = this.years[v[0]];
				let m = v[1] + 1;
				let w = v[2];
				this.weeks = weekjs.getWeeksByMonth(y, m,this.val,this.formatType).arr;
				this.result = {
					week: this.weeks[w]
				}
			},
			onCancel() {
				this.$emit('change');
			},
			onSure() {
				this.$emit('change', this.result);
			}
		}

	}
</script>

<style lang="scss" scoped>
	.ccq-week-picker {
		background-color: #FFFFFF;
		border-top: 1px solid #e3e3e3;
	}

	.ccq-week-popup_header {
		box-sizing: border-box;
		width: 100%;
		height: 40px;
		padding: 0 30rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		background-color: #FFFFFF;
		border-bottom: 1px solid #e3e3e3;
	}

	.ccq-week-popup-text {
		font-size: 16px;

		&.cancel {
			color: #DD524D;
		}

		&.sure {
			color: #007AFF;
		}
	}

	.ccq-week-picker_view {
		width: 100%;
		height: 450rpx;
	}

	.ccq-week-picker_item {
		display: flex;
		align-items: center;
		justify-content: center;

		&.years {
			flex: 1;
		}

		&.months {
			flex: 1;
		}

		&.weeks {
			flex: 3;
		}
	}

	.ccq-week-picker_item_view {
		font-size: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
	}
</style>
