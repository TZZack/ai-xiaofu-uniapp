// 根据id获取文章
'use strict';

const db = uniCloud.database()
exports.main = async (data, context) => {
	const { id } = data
	if (!id) {
		return null
	}
	const ret = await db.collection('articles').doc(id).get()
	return ret.data || []
};
