// 获取所有标记为已删除的文章记录
'use strict';

const db = uniCloud.database()
exports.main = async () => {
	return await db.collection('articles')
		.where({
			isDeleted: 1
		})
		.orderBy('push_time', 'desc')
		.limit(999)
		.get()
};
