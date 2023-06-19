// 获取会议列表
'use strict';

const db = uniCloud.database()
exports.main = async (event, context) => {
	const {
		pageNo = 1,
		pageSize = 20,
	} = event;
	return await db.collection('meetings')
		.orderBy('start_time', 'desc')
		.skip((pageNo - 1) * pageSize)
		.limit(pageSize).get()
};
