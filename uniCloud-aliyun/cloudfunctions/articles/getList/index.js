// 获取文章列表
'use strict';

const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	const {
		category,
		isAdmin = false,
		pageNo = 1,
		pageSize = 20,
	} = event;

	// admin不做isDeleted的过滤
	const collectionInstance = db.collection('articles')
	let collectionObj
	if (category === -1) {
		if (!isAdmin) {
			collectionObj = collectionInstance
				.where({
					isDeleted: dbCmd.neq(1)
				})
		} else {
			collectionObj = collectionInstance
		}
	} else {
		if (isAdmin) {
			collectionObj = collectionInstance
				.where({
					type: category,
				})
		} else {
			collectionObj = collectionInstance
				.where({
					type: category,
					isDeleted: dbCmd.neq(1)
				})
		}
	}

	return await collectionObj.orderBy('push_time', 'desc')
			.skip((pageNo - 1) * pageSize)
			.limit(pageSize)
			.get()
};
