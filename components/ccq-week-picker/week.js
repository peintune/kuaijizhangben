import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(weekday)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
// 解决苹果电脑本地语言配置
require('dayjs/locale/en');
dayjs.locale('en')

/**
 * 根据年月份得到周数据
 * @param {String} y 年
 * @param {String} m 月
 * @param {String} v 当前日期
 * @param {Number} t 格式化类型
 */
function getWeeksByMonth(y, m, v, t) {
    // 2021-12-1是11月的第5周（对这种情况进行判断）
    if(dayjs(v).date() < dayjs(v).day()){
        m = m-1
    }
    let len = dayjs(`${y}-${m}`).daysInMonth();
    let arr = [],
        weekIndex, week;
    [...Array(len)].forEach((c, i) => {
        let date = dayjs(`${y}-${m}-${i+1}`);
        if (date.day() == 1) {
            let date_start = date.weekday(1);
            let date_end = date.weekday(7);
            let index = arr.length + 1;
            let start = t ? date_start.format('MM月DD日') : date_start.format('MM-DD');
            let end = t ? date_end.format('MM月DD日') : date_end.format('MM-DD');
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
            week = obj
            if (dayjs(v).isSameOrAfter(date_start, 'date') && dayjs(v).isSameOrBefore(
                    date_end, 'date')) {
                        week = obj
                weekIndex = index;
            }
        }
    })

    return {
        arr,
        weekIndex,
        week
    }
}

module.exports = {
    getWeeksByMonth
}
