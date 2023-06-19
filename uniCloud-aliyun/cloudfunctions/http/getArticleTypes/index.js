// 获取文章分类列表
'use strict';

const db = uniCloud.database()
exports.main = async () => {
	const ret = await db.collection('article-types').get()
	return ret.data || []
};
