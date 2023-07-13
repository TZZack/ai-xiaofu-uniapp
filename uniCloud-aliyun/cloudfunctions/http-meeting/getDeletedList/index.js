// 获取所有标记为已删除的会议记录
'use strict';

const db = uniCloud.database()
exports.main = async () => {
	return await db.collection('meetings')
		.where({
			isDeleted: 1
		})
		.orderBy('start_time', 'desc')
		.limit(999)
		.get()
};
