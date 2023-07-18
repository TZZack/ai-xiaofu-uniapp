const DATE_FORMAT_REGEX = /[YmdHis]/g;
const DATE_FORMAT_FUNCTION = (function () {
    const DECIMAL = 2;
    let zeroLeftPad = (v) => leftPad(v, DECIMAL, '0');

    return {
        Y: (date) => String(date.getFullYear()),
        m: (date) => zeroLeftPad(date.getMonth() + 1),
        d: (date) => zeroLeftPad(date.getDate()),
        H: (date) => zeroLeftPad(date.getHours()),
        i: (date) => zeroLeftPad(date.getMinutes()),
        s: (date) => zeroLeftPad(date.getSeconds())
    };
}());

function leftPad (str, size, character = ' ') {
    let result = String(str);
    while (result.length < size) {
        result = character + result;
    }
    return result;
}

/**
 * 时间格式化的函数，简化实现，只支持YmdHis几种关键字
 * @param {*} date   日期对象，或者时间戳（可以是数字或者字符串）
 * @param {String} format 时间格式字符串
 * @returns {String} 返回结果如下：2019-01-20 12:23:34
 */
export const encodeDate = (date, format = 'Y-m-d H:i:s') => {
    if (typeof date === 'string') {
        if (/^\d+$/.test(date)) {
            date = parseInt(date, 10);
        }
    }

    //  时间戳类型
    if (typeof date === 'number') {
        date = date.toString().length === 13 ? date : 1000 * date;
        date = new Date(date);
    }

    return (format).replace(DATE_FORMAT_REGEX, m => {
        if (m in DATE_FORMAT_FUNCTION) {
            return DATE_FORMAT_FUNCTION[m](date);
        }
        return m;
    });
}

/**
 * 按交互需求格式化时间为
 * 不足1小时：1小时内
 * 1-2小时：1小时前
 * ...
 * 1-2天：1天前
 * ...
 * 1-2周：1周前
 * ...
 * 4-5周：4周前
 * 
 * 每天会定时清掉1个月前的数据，所以最多到4周前
 */
const oneHour = 60 * 60 * 1000
const oneDay = 24 * oneHour
const oneWeek = 7 * oneDay
export const timeTransform = (timeStr) => {
	const timestamp = new Date(timeStr).getTime()
	const curTimestamp = new Date().getTime()
	const dValue = curTimestamp - timestamp
	if (dValue < oneHour) {
		return '1小时内'
	} else if (dValue < oneDay) {
		return Math.floor(dValue / oneHour) + '小时前'
	} else if (dValue < oneWeek) {
		return Math.floor(dValue / oneDay) + '天前'
	} else {
		return Math.floor(dValue / oneWeek) + '周前'
	}
}
