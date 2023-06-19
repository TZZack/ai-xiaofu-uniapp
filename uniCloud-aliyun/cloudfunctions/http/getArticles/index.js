// 获取所有会议记录
'use strict';

const db = uniCloud.database()
exports.main = async () => {
	const ret = await db.collection('articles').get()
	return ret.data || []
};
