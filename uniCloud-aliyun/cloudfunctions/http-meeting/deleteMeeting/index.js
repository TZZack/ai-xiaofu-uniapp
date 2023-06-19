// 删除会议
'use strict';

const db = uniCloud.database()
exports.main = async (data, context) => {
	const { id } = data
	if (!id) {
		return null
	}
	return await db.collection('meetings').doc(id).remove()
};
