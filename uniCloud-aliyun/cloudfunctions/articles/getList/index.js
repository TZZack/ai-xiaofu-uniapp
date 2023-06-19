// 获取文章列表
'use strict';

const db = uniCloud.database()
exports.main = async (event, context) => {
	const {
		category,
		pageNo = 1,
		pageSize = 20,
	} = event;

	if (category === -1) {
		return await db.collection('articles')
			.orderBy('create_time', 'desc')
			.skip((pageNo - 1) * pageSize)
			.limit(pageSize)
			.get()
	}

	return await db.collection('articles')
		.where({
			type: category
		})
		.orderBy('create_time', 'desc')
		.skip((pageNo - 1) * pageSize)
		.limit(pageSize)
		.get()
};
