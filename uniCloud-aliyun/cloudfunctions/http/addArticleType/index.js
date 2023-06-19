// 新增文章类型s
'use strict';

const db = uniCloud.database()
exports.main = async (data, context) => {
	if (!data) {
		return null
	}
	return await db.collection('article-types').add(data)
};
