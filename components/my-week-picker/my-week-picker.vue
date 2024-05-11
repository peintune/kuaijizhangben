<template>
	<view>
		<picker :value="indexArr" mode="multiSelector" :range="multiArray" @change="testChange"
			@columnchange="bindMultiPickerColumnChange">
			<view class="my-week-picker_input">
				{{result.year}}年{{result.month}}月第{{result.number}}周（{{result.start}}至{{result.end}}）
			</view>
		</picker>
	</view>
</template>

<script>
	import dayjs from 'dayjs';
	import weekday from 'dayjs/plugin/weekday';
	import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
	import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
	dayjs.extend(weekday)
	dayjs.extend(isSameOrAfter)
	dayjs.extend(isSameOrBefore)
	// 解决苹果电脑本地语言配置
	require('dayjs/locale/en')
	dayjs.locale('en')

	export default {
		name: "my-week-picker",
		data() {
			return {
				indexArr: [0, 0, 0],
				multiArray: [
					['亚洲', '欧洲'],
					['中国', '日本'],
					['北京', '上海', '广州']
				]
			};
		},
		computed: {
			result() {
				// 2021年
				// 9月
				// 第1周（09月06日 至 09月12日）
				let res = {
					year: 2021,
					month: 9,
					number: 2,
					start: "09月13日",
					end: "09月19日"
				}
				return res
			}
		},
		mounted() {
			this.dateInit()
		},
		methods: {
			dateInit() {
				let y = dayjs().year();
				let m = dayjs().month();
				let w;
				let y_arr = []; // 年
				let m_arr = [...Array(12)].map((c, i) => i + 1); // 月份
				let w_arr = [];
				for (let i = (y - 50); i <= (y + 50); i++) {
					y_arr.push(i)
				}
				let week_res = this.getWeek(y, m + 1);
				w_arr = week_res.arr.map(i => i.text);
				w = week_res.weekIndex;
				this.multiArray = [y_arr, m_arr, w_arr];
				this.indexArr = [50, m, w - 1]
			},
			/**
			 * 根据年月查询周信息
			 * @param {Object} y 年
			 * @param {Object} m 月
			 */
			getWeek(y, m) {
				let type = this.formatType;
				let len = dayjs(`${y}-${m}`).daysInMonth();
				let arr = [],
					weekIndex, week;
				let v = this.val;
				[...Array(len)].forEach((c, i) => {
					let date = dayjs(`${y}-${m}-${i+1}`);
					if (date.day() == 1) {
						let date_start = date.weekday(1);
						let date_end = date.weekday(7);
						console.log(
							`${y}年${m}月第${arr.length+1}周为\r\n${date_start.format('YYYY年MM月DD日')} 至 ${date_end.format('YYYY年MM月DD日')}`
						);
						let index = arr.length + 1;
						let start = type ? date_start.format('MM月DD日') : date_start.format('MM-DD');
						let end = type ? date_end.format('MM月DD日') : date_end.format('MM-DD');
						let obj = {
							text: `第${index}周(${start}至${end})`,
							year: y,
							month: m,
							val: `${dayjs(date_start).format('YYYY-MM-DD')}`,
							start: start + '(周一)',
							end: end + '(周日)',
							index: index //1:该月第一周   2:该月第二周
						}
						arr.push(obj)
						if (dayjs(v).isSameOrAfter(date_start, 'date') && dayjs(v).isSameOrBefore(
								date_end, 'date')) {
							weekIndex = index;
							week = obj
						}
					}
				})
				return {
					arr,
					weekIndex,
					week
				}
			},
			bindMultiPickerColumnChange(e) {
				let column = e.detail.column;
				let index = e.detail.value;
				let year, month, week;
				if (column == 0) {
					// 拖动年
					year = this.year[index];
				} else if (column == 1) {
					// 拖动月
					month = this.month[index];
				}

				// 得到年份，得到月份，根据年月。计算周信息

			},
			testChange(e) {
				console.log(e);
			},
		}

	}
</script>

<style>
	.my-week-picker_input {
		border: 1px solid #F1F1F1;
		border-radius: 8rpx;
		padding: 20rpx;
	}

	/* 修改样式 */
	uni-picker-view-column:nth-child(1) {
		flex: 1;
	}

	uni-picker-view-column:nth-child(2) {
		flex: 1;
	}
	
	.uni-picker-view-column{
		flex: 3 !important;
	}
</style>
