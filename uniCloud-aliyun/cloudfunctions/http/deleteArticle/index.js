// 删除文章
'use strict';

const db = uniCloud.database()
exports.main = async (data, context) => {
	const { id } = data
	if (!id) {
		return null
	}
	return await db.collection('articles').doc(id).remove()
};
