// 获取文章类型
'use strict';

const db = uniCloud.database()
exports.main = async (event, context) => {
	const result = await db.collection('article-types').get()
	
	//返回数据给客户端
	return result
};
