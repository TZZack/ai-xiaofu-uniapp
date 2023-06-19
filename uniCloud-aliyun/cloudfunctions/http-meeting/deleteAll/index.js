// 删除所有会议记录
'use strict';

const db = uniCloud.database()
exports.main = async () => {
	// limit(999),最大是1000
	const ret = await db.collection('meetings').limit(999).get()
	ret.data.forEach(item => {
		if (item._id) {
			db.collection('meetings').doc(item._id).remove()
		}
	})

	return '等待后台异步执行...'
};
