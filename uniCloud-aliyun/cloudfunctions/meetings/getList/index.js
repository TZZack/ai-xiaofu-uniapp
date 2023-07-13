// 获取会议列表
'use strict';

const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	const {
		isAdmin = false,
		pageNo = 1,
		pageSize = 20,
	} = event;

	// admin不做isDeleted的过滤
	let collectionObj = db.collection('meetings')
	if (!isAdmin) {
		collectionObj = db.collection('meetings')
						.where({
							isDeleted: dbCmd.neq(1)
						})
	}

	return await collectionObj
		.orderBy('start_time', 'desc')
		.skip((pageNo - 1) * pageSize)
		.limit(pageSize)
		.get()
};
