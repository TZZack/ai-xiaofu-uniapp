// 根据id更新文章的删除状态
'use strict';

const db = uniCloud.database()
exports.main = async (event, context) => {
	const { id, isDeleted } = event;

	if (!id) {
		return 'error'
	}

	return await db.collection('articles').doc(id).update({
		isDeleted
	})
};
