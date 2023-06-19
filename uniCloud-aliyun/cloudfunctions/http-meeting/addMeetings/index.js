// 新增会议s
'use strict';

const db = uniCloud.database()
exports.main = async (data, context) => {
	if (!data || !data.length) {
		return null
	}
	data.forEach(meeting => {
		// id处理
		meeting._id = meeting.article_id
		delete meeting.article_id
		// link处理
		meeting.link = meeting.article_link
		delete meeting.article_link
		// 创建时间处理
		meeting.create_time = meeting.created_time ? new Date(meeting.created_time) : new Date()
		delete meeting.created_time
		// 会议开始时间处理
		meeting.start_time = meeting.start_time ? new Date(meeting.start_time) : null
		// 简介处理
		meeting.summary = meeting.content
		delete meeting.content
	})
	return await db.collection('meetings').add(data)
};
