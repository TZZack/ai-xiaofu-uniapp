// 更新会议记录
'use strict';

const db = uniCloud.database()
exports.main = async (data, context) => {
	const { id, newValue } = data
	if (!id || !newValue) {
		return null
	}
	if (newValue.article_id) {
		newValue._id = newValue.article_id
		delete newValue.article_id
	}
	if (newValue.article_link) {
		newValue.link = newValue.article_link
		delete newValue.article_link
	}
	if (newValue.created_time) {
		newValue.create_time = new Date(newValue.created_time)
		delete newValue.created_time
	}
	if (newValue.start_time) {
		newValue.start_time = new Date(newValue.start_time)
	}
	if (newValue.content) {
		newValue.summary = newValue.content
		delete newValue.content
	}

	return await db.collection('meetings').doc(id).update(newValue)
};
