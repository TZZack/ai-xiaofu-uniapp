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
		// 时间处理（注意：统一使用使用时间戳，因为阿里云和腾讯云都是中时区）
		meeting.create_time = meeting.created_time ? meeting.created_time : new Date().getTime()
		delete meeting.created_time
		// 简介处理
		meeting.summary = meeting.content
		delete meeting.content
	})
	return await db.collection('meetings').add(data)
};
