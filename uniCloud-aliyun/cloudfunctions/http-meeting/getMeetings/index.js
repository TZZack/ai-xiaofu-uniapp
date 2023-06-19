// 获取所有会议记录
'use strict';

const db = uniCloud.database()
exports.main = async () => {
	const ret = await db.collection('meetings').get()
	return ret.data || []
};
