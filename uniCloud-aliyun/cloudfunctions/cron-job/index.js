/**
 * 定时任务
 * 1. 文章，保留一个月（即删除一个月前的文章）
 * 2. 会议，保留一周（即删除一周前的会议）
 */

'use strict';

const db = uniCloud.database()
exports.main = async (event, context) => {
	// 查询1个月以前的文章数据并删除
	const ret1 = await db.collection('articles').where({
		create_time: db.command.lte(new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000))
	}).get()
	ret1.data.forEach(item => {
		if (item._id) {
			db.collection('articles').doc(item._id).remove()
		}
	})

	// 查询1周前的会议数据并删除
	const ret2 = await db.collection('meetings').where({
		start_time: db.command.lte(new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000))
	}).get()
	ret2.data.forEach(item => {
		if (item._id) {
			db.collection('meetings').doc(item._id).remove()
		}
	})

	return event
};
