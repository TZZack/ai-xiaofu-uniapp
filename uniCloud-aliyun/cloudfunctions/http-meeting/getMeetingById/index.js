// 根据id获取会议
'use strict';

const db = uniCloud.database()
exports.main = async (data, context) => {
	const { id } = data
	if (!id) {
		return null
	}
	const ret = await db.collection('meetings').doc(id).get()
	return ret.data || []
};
