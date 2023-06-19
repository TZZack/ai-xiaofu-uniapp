// 删除文章分类
'use strict';

const db = uniCloud.database()
exports.main = async (data, context) => {
	// data作为查询条件，可以是 id:x，也可以是value:x
	if (!data) {
		return null
	}
	return await db.collection('article-types').where(data).remove()
};
