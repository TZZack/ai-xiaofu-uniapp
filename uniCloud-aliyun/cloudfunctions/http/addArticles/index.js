// 新增文章s
'use strict';

const db = uniCloud.database()
exports.main = async (data, context) => {
	if (!data || !data.length) {
		return null
	}
	const typeRet = await db.collection('article-types').get()
	const typeList = typeRet.data
	data.forEach(article => {
		// id处理
		article._id = article.id
		delete article.id
		// 时间处理（注意：统一使用使用时间戳，因为阿里云和腾讯云都是中时区）
		article.create_time = article.create_time ? article.create_time : new Date().getTime()
		article.push_time = article.push_time ? article.push_time : new Date().getTime()
		// 类型处理
		const targetType = typeList.find(type => type.alias === article.type)
		article.type = targetType ? targetType.value : 999 // 999 为其他
	})
	return await db.collection('articles').add(data)
};
