// 根据id更新会议的删除状态
'use strict';

const db = uniCloud.database()
exports.main = async (event, context) => {
	const { id, isDeleted } = event;

	if (!id) {
		return 'error'
	}

	return await db.collection('meetings').doc(id).update({
		isDeleted
	})
};
